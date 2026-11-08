import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { login } from "./helpers/auth";

const prisma = new PrismaClient();

const ARTICLE_TITLE = "Mon article Playwright E2E";
const ARTICLE_CONTENT =
  "Ceci est un contenu de test généré par Playwright. Il contient plus de 50 caractères pour valider le schéma Zod avec succès.";
const COMMENT_TEXT = "Commentaire de test E2E !";

test.describe("Articles", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterAll(async () => {
    // Supprime ce que les tests ont créé (y compris les restes des anciens runs)
    await prisma.comment.deleteMany({ where: { content: COMMENT_TEXT } });
    await prisma.article.deleteMany({ where: { title: ARTICLE_TITLE } });
    await prisma.$disconnect();
  });

  test("devrait afficher les articles du seed sur le feed", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", {
        name: "Pourquoi TypeScript est incontournable",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Les bases du Web3" }),
    ).toBeVisible();
  });

  test("devrait permettre de créer un nouvel article", async ({ page }) => {
    await page.getByRole("link", { name: "Créer un article" }).click();
    await page.waitForURL("/articles/new");

    await page
      .getByLabel("Thème", { exact: true })
      .selectOption({ label: "JavaScript" });
    await page.getByLabel("Titre de l'article").fill(ARTICLE_TITLE);
    await page.getByLabel("Contenu de l'article").fill(ARTICLE_CONTENT);

    await page.getByRole("button", { name: "Créer", exact: true }).click();

    // (?!new) : on attend la page de l'article, pas /articles/new
    await page.waitForURL(/\/articles\/(?!new)/);

    await expect(
      page.getByRole("heading", { name: ARTICLE_TITLE }),
    ).toBeVisible();
    await expect(page.getByText("Ceci est un contenu de test")).toBeVisible();
  });

  test("devrait permettre de lire un article et d'ajouter un commentaire", async ({
    page,
  }) => {
    await page
      .locator('a[href^="/articles/"]', {
        hasText: "Pourquoi TypeScript est incontournable",
      })
      .click();
    await page.waitForURL(/\/articles\/(?!new)/);

    await expect(
      page.getByText("TypeScript ajoute un typage statique"),
    ).toBeVisible();

    await page
      .getByPlaceholder("Écrivez ici votre commentaire")
      .fill(COMMENT_TEXT);
    await page.getByRole("button", { name: "Envoyer le commentaire" }).click();

    await expect(page.getByText(COMMENT_TEXT).first()).toBeVisible();
  });

  test("devrait trier les articles par plus anciens puis par plus récents", async ({
    page,
  }) => {
    const sortButton = page.getByRole("button", { name: /trier par/i });

    await sortButton.click();
    await page.waitForURL(/\?sort=oldest/);
    await expect(
      page.getByRole("button", { name: /plus anciens en premier/i }),
    ).toBeVisible();

    await sortButton.click();
    await page.waitForURL(/\?sort=recent/);
    await expect(
      page.getByRole("button", { name: /plus récents en premier/i }),
    ).toBeVisible();
  });
});
