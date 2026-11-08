import { test, expect, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { login } from "./helpers/auth";

const prisma = new PrismaClient();

const USER_EMAIL = "marouane@mdd.dev";
const TOPIC_NAME = "JavaScript";

let userId: string;
let topicId: string;
let wasSubscribed: boolean;

// La carte du thème, sur la page Thèmes comme sur la page Profil
function topicCard(page: Page) {
  return page.locator("article").filter({
    has: page.getByRole("heading", { name: TOPIC_NAME, exact: true }),
  });
}

test.describe("Gestion des Thèmes", () => {
  // Les tests partagent le même abonnement en base : ils s'exécutent à la suite
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: USER_EMAIL },
    });
    const topic = await prisma.topic.findFirstOrThrow({
      where: { name: TOPIC_NAME },
    });
    userId = user.id;
    topicId = topic.id;

    wasSubscribed =
      (await prisma.subscription.count({ where: { userId, topicId } })) > 0;
  });

  test.beforeEach(async ({ page }) => {
    // Chaque test part sans abonnement au thème
    await prisma.subscription.deleteMany({ where: { userId, topicId } });
    await login(page);
  });

  test.afterAll(async () => {
    // Remet le compte du seed dans son état d'origine
    if (wasSubscribed) {
      await prisma.subscription.upsert({
        where: { userId_topicId: { userId, topicId } },
        create: { userId, topicId },
        update: {},
      });
    } else {
      await prisma.subscription.deleteMany({ where: { userId, topicId } });
    }
    await prisma.$disconnect();
  });

  test("devrait permettre de s'abonner à un thème", async ({ page }) => {
    await page.goto("/themes");

    const card = topicCard(page);
    await card.getByRole("button", { name: "S'abonner" }).click();

    const subscribedButton = card.getByRole("button", { name: "Déjà abonné" });
    await expect(subscribedButton).toBeVisible();
    await expect(subscribedButton).toBeDisabled();
  });

  test("devrait permettre de se désabonner depuis le profil", async ({
    page,
  }) => {
    await prisma.subscription.create({ data: { userId, topicId } });

    await page.goto("/profile");

    const card = topicCard(page);
    await card.getByRole("button", { name: "Se désabonner" }).click();
    await expect(card).toHaveCount(0);

    // Le thème est de nouveau proposé sur la page Thèmes
    await page.goto("/themes");
    await expect(card.getByRole("button", { name: "S'abonner" })).toBeVisible();
  });
});
