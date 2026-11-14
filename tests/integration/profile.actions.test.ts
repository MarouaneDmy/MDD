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
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  updateProfile,
  unsubscribeFromTopic,
  getUserProfile,
} from "@/app/actions/profile.actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const prisma = new PrismaClient();
const mockedAuth = auth as unknown as Mock;

const PREFIX = "action_profile";
const USER = {
  email: `${PREFIX}@mdd.dev`,
  username: `${PREFIX}_user`,
  password: "Password123!",
};
const OTHER_EMAIL = `${PREFIX}_other@mdd.dev`;
const TOPIC_NAME = "TestActionsProfile Topic";

let userId: string;
let topicId: string;
let initialHash: string;

function buildFormData(
  overrides: Partial<{
    username: string;
    email: string;
    password: string;
  }> = {},
) {
  const fields = {
    username: USER.username,
    email: USER.email,
    password: "",
    ...overrides,
  };

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

async function cleanup() {
  await prisma.subscription.deleteMany({
    where: { user: { email: { startsWith: PREFIX } } },
  });
  await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  await prisma.topic.deleteMany({ where: { name: TOPIC_NAME } });
}

beforeAll(async () => {
  await cleanup();

  initialHash = await bcrypt.hash(USER.password, 10);

  const user = await prisma.user.create({
    data: { ...USER, password: initialHash },
  });
  userId = user.id;

  await prisma.user.create({
    data: {
      email: OTHER_EMAIL,
      username: `${PREFIX}_other`,
      password: initialHash,
    },
  });

  const topic = await prisma.topic.create({ data: { name: TOPIC_NAME } });
  topicId = topic.id;
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

beforeEach(async () => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: userId } });

  await prisma.user.update({
    where: { id: userId },
    data: { ...USER, password: initialHash },
  });
  await prisma.subscription.deleteMany({ where: { userId } });
});

describe("updateProfile", () => {
  it("devrait refuser un utilisateur non connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await updateProfile(buildFormData());

    expect(result).toEqual({
      success: false,
      error: "Vous devez être connecté",
    });
  });

  it.each([
    ["un e-mail invalide", { email: "pas-un-email" }],
    ["un username trop court", { username: "ab" }],
  ])("devrait refuser %s", async (_label, overrides) => {
    const result = await updateProfile(buildFormData(overrides));

    expect(result).toMatchObject({
      success: false,
      error: expect.any(String),
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("devrait mettre à jour le username et l'e-mail sans toucher au mot de passe", async () => {
    const result = await updateProfile(
      buildFormData({
        username: `${PREFIX}_renamed`,
        email: `${PREFIX}_renamed@mdd.dev`,
        password: "",
      }),
    );

    expect(result).toEqual({ success: true });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.username).toBe(`${PREFIX}_renamed`);
    expect(user!.email).toBe(`${PREFIX}_renamed@mdd.dev`);
    expect(user!.password).toBe(initialHash);
    expect(revalidatePath).toHaveBeenCalledWith("/profile");
  });

  it("devrait changer le mot de passe et le hacher", async () => {
    const result = await updateProfile(
      buildFormData({ password: "Nouveau_mdp_123" }),
    );

    expect(result).toEqual({ success: true });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user!.password).not.toBe("Nouveau_mdp_123");
    expect(user!.password).not.toBe(initialHash);
    expect(await bcrypt.compare("Nouveau_mdp_123", user!.password)).toBe(true);
  });

  it("devrait refuser un e-mail déjà utilisé par un autre compte", async () => {
    const result = await updateProfile(buildFormData({ email: OTHER_EMAIL }));

    expect(result).toEqual({
      success: false,
      error: "Cet email est déjà utilisé par un autre compte",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("devrait renvoyer une erreur générique si le compte n'existe plus", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "utilisateur-inexistant" } });

    const result = await updateProfile(buildFormData());

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de la mise à jour",
    });
  });
});

describe("unsubscribeFromTopic", () => {
  it("devrait refuser un utilisateur non connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await unsubscribeFromTopic(topicId);

    expect(result).toEqual({
      success: false,
      error: "Vous devez être connecté",
    });
  });

  it("devrait supprimer l'abonnement et rafraîchir les pages concernées", async () => {
    await prisma.subscription.create({ data: { userId, topicId } });

    const result = await unsubscribeFromTopic(topicId);

    expect(result).toEqual({ success: true });

    const remaining = await prisma.subscription.count({
      where: { userId, topicId },
    });
    expect(remaining).toBe(0);

    expect(revalidatePath).toHaveBeenCalledWith("/profile");
    expect(revalidatePath).toHaveBeenCalledWith("/themes");
    expect(revalidatePath).toHaveBeenCalledWith("/feed");
  });

  it("devrait renvoyer une erreur générique si l'abonnement n'existe pas", async () => {
    const result = await unsubscribeFromTopic(topicId);

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors du désabonnement",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("getUserProfile", () => {
  it("devrait renvoyer null si l'utilisateur n'est pas connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    expect(await getUserProfile()).toBeNull();
  });

  it("devrait renvoyer le profil avec ses abonnements et leurs thèmes", async () => {
    await prisma.subscription.create({ data: { userId, topicId } });

    const profile = await getUserProfile();

    expect(profile).not.toBeNull();
    expect(profile!.username).toBe(USER.username);
    expect(profile!.email).toBe(USER.email);
    expect(profile!.subscriptions).toHaveLength(1);
    expect(profile!.subscriptions[0].topic.name).toBe(TOPIC_NAME);
  });

  it("ne devrait pas exposer le mot de passe", async () => {
    const profile = await getUserProfile();

    expect(profile).not.toHaveProperty("password");
  });
});
