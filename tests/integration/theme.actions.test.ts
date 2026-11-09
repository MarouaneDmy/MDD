import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  vi,
  type Mock,
} from "vitest";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  toggleSubscription,
  getAllTopicsWithSubscriptionStatus,
} from "@/app/actions/theme.actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const prisma = new PrismaClient();
const mockedAuth = auth as unknown as Mock;

const PREFIX = "action_theme";
const TOPIC_A_NAME = "TestActionsTheme A";
const TOPIC_Z_NAME = "TestActionsTheme Z";

let userId: string;
let otherUserId: string;
let topicAId: string;
let topicZId: string;

async function cleanup() {
  await prisma.subscription.deleteMany({
    where: { user: { email: { startsWith: PREFIX } } },
  });
  await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  await prisma.topic.deleteMany({
    where: { name: { in: [TOPIC_A_NAME, TOPIC_Z_NAME] } },
  });
}

async function findOurTopics() {
  const topics = await getAllTopicsWithSubscriptionStatus();
  return {
    all: topics,
    a: topics.find((t) => t.id === topicAId)!,
    z: topics.find((t) => t.id === topicZId)!,
  };
}

beforeAll(async () => {
  await cleanup();

  const user = await prisma.user.create({
    data: {
      email: `${PREFIX}@mdd.dev`,
      username: `${PREFIX}_user`,
      password: "hash-non-utilise",
    },
  });
  userId = user.id;

  const otherUser = await prisma.user.create({
    data: {
      email: `${PREFIX}_other@mdd.dev`,
      username: `${PREFIX}_other`,
      password: "hash-non-utilise",
    },
  });
  otherUserId = otherUser.id;

  const topicZ = await prisma.topic.create({ data: { name: TOPIC_Z_NAME } });
  const topicA = await prisma.topic.create({ data: { name: TOPIC_A_NAME } });
  topicZId = topicZ.id;
  topicAId = topicA.id;

  await prisma.subscription.create({
    data: { userId: otherUserId, topicId: topicAId },
  });
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

beforeEach(async () => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: userId } });

  await prisma.subscription.deleteMany({ where: { userId } });
});

describe("toggleSubscription", () => {
  it("devrait refuser un utilisateur non connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await toggleSubscription(topicAId);

    expect(result).toEqual({
      success: false,
      error: "Vous devez être connecté",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("devrait abonner l'utilisateur et rafraîchir les pages concernées", async () => {
    const result = await toggleSubscription(topicAId);

    expect(result).toEqual({ success: true, action: "subscribed" });

    const count = await prisma.subscription.count({
      where: { userId, topicId: topicAId },
    });
    expect(count).toBe(1);

    expect(revalidatePath).toHaveBeenCalledWith("/themes");
    expect(revalidatePath).toHaveBeenCalledWith("/feed");
  });

  it("devrait désabonner l'utilisateur s'il est déjà abonné", async () => {
    await prisma.subscription.create({ data: { userId, topicId: topicAId } });

    const result = await toggleSubscription(topicAId);

    expect(result).toEqual({ success: true, action: "unsubscribed" });

    const count = await prisma.subscription.count({
      where: { userId, topicId: topicAId },
    });
    expect(count).toBe(0);

    expect(revalidatePath).toHaveBeenCalledWith("/themes");
    expect(revalidatePath).toHaveBeenCalledWith("/feed");
  });

  it("devrait alterner entre abonné et désabonné à chaque appel", async () => {
    const first = await toggleSubscription(topicZId);
    const second = await toggleSubscription(topicZId);

    expect(first).toMatchObject({ action: "subscribed" });
    expect(second).toMatchObject({ action: "unsubscribed" });
  });

  it("ne devrait pas toucher aux abonnements des autres utilisateurs", async () => {
    await toggleSubscription(topicAId);
    await toggleSubscription(topicAId);

    const otherCount = await prisma.subscription.count({
      where: { userId: otherUserId, topicId: topicAId },
    });
    expect(otherCount).toBe(1);
  });

  it("devrait renvoyer une erreur générique si le thème n'existe pas", async () => {
    const result = await toggleSubscription("theme-inexistant");

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("getAllTopicsWithSubscriptionStatus", () => {
  it("devrait renvoyer les thèmes triés par nom", async () => {
    const { all } = await findOurTopics();
    const names = all.map((t) => t.name);

    expect(names.indexOf(TOPIC_A_NAME)).toBeLessThan(
      names.indexOf(TOPIC_Z_NAME),
    );
  });

  it("devrait marquer tous les thèmes comme non abonnés sans session", async () => {
    mockedAuth.mockResolvedValue(null);

    const { all } = await findOurTopics();

    expect(all.length).toBeGreaterThan(0);
    expect(all.every((t) => t.isSubscribed === false)).toBe(true);
  });

  it("devrait indiquer l'abonnement de l'utilisateur connecté, thème par thème", async () => {
    await prisma.subscription.create({ data: { userId, topicId: topicAId } });

    const { a, z } = await findOurTopics();

    expect(a.isSubscribed).toBe(true);
    expect(z.isSubscribed).toBe(false);
  });

  it("devrait compter les abonnés de chaque thème", async () => {
    await prisma.subscription.create({ data: { userId, topicId: topicAId } });

    const { a, z } = await findOurTopics();

    expect(a._count.subscribers).toBe(2);
    expect(z._count.subscribers).toBe(0);
  });

  it("ne devrait pas considérer comme abonné un thème suivi uniquement par un autre", async () => {
    const { a } = await findOurTopics();

    expect(a.isSubscribed).toBe(false);
    expect(a._count.subscribers).toBe(1);
  });
});
