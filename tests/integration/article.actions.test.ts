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
import { createArticle, getAllTopics } from "@/app/actions/article.actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const prisma = new PrismaClient();
const mockedAuth = auth as unknown as Mock;

const USER_EMAIL = "action_article@mdd.dev";
const TOPIC_A_NAME = "TestActionsArticle A";
const TOPIC_Z_NAME = "TestActionsArticle Z";

const VALID_TITLE = "Un titre d'article valide";
const VALID_CONTENT =
  "Ceci est un contenu de test suffisamment long pour passer la validation du schéma Zod.";

let userId: string;
let topicAId: string;
let topicZId: string;

function buildFormData(
  overrides: Partial<{ title: string; content: string; topics: string[] }> = {},
) {
  const { title, content, topics } = {
    title: VALID_TITLE,
    content: VALID_CONTENT,
    topics: [topicAId],
    ...overrides,
  };

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  topics.forEach((id) => formData.append("topics", id));
  return formData;
}

async function cleanup() {
  await prisma.article.deleteMany({ where: { author: { email: USER_EMAIL } } });
  await prisma.user.deleteMany({ where: { email: USER_EMAIL } });
  await prisma.topic.deleteMany({
    where: { name: { in: [TOPIC_A_NAME, TOPIC_Z_NAME] } },
  });
}

beforeAll(async () => {
  await cleanup();

  const user = await prisma.user.create({
    data: {
      email: USER_EMAIL,
      username: "action_article_user",
      password: "hash-non-utilise",
    },
  });
  userId = user.id;

  const topicZ = await prisma.topic.create({ data: { name: TOPIC_Z_NAME } });
  const topicA = await prisma.topic.create({ data: { name: TOPIC_A_NAME } });
  topicZId = topicZ.id;
  topicAId = topicA.id;
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: userId } });
});

describe("createArticle : authentification", () => {
  it("devrait refuser un utilisateur non connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await createArticle(buildFormData());

    expect(result).toEqual({
      success: false,
      error: "Vous devez être connecté pour créer un article",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("createArticle : validation", () => {
  it.each([
    ["un titre trop court", { title: "abc" }],
    ["un contenu trop court", { content: "trop court" }],
  ])("devrait refuser %s", async (_label, overrides) => {
    const result = await createArticle(buildFormData(overrides));

    expect(result).toMatchObject({
      success: false,
      error: expect.any(String),
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("createArticle : succès", () => {
  it("devrait créer l'article avec son auteur et ses thèmes", async () => {
    const result = await createArticle(
      buildFormData({ topics: [topicAId, topicZId] }),
    );

    expect(result).toMatchObject({
      success: true,
      articleId: expect.any(String),
    });

    const article = await prisma.article.findUnique({
      where: { id: (result as { articleId: string }).articleId },
      include: { topics: true },
    });

    expect(article).not.toBeNull();
    expect(article!.title).toBe(VALID_TITLE);
    expect(article!.authorId).toBe(userId);
    expect(article!.topics.map((t) => t.topicId).sort()).toEqual(
      [topicAId, topicZId].sort(),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/feed");
  });
});

describe("createArticle : erreur inattendue", () => {
  it("devrait renvoyer une erreur générique si la base refuse l'écriture", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "utilisateur-inexistant" } });

    const result = await createArticle(buildFormData());

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de la création de l'article",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("getAllTopics", () => {
  it("devrait renvoyer les thèmes triés par nom", async () => {
    const topics = await getAllTopics();
    const names = topics.map((t) => t.name);

    expect(names).toContain(TOPIC_A_NAME);
    expect(names).toContain(TOPIC_Z_NAME);
    expect(names.indexOf(TOPIC_A_NAME)).toBeLessThan(
      names.indexOf(TOPIC_Z_NAME),
    );
  });
});
