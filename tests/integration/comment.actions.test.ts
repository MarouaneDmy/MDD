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
import { addComment } from "@/app/actions/comment.actions";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const prisma = new PrismaClient();
const mockedAuth = auth as unknown as Mock;

const USER_EMAIL = "action_comment@mdd.dev";
const VALID_CONTENT = "Un commentaire de test valide";

let userId: string;
let articleId: string;

function buildFormData(
  overrides: Partial<{ content: string; articleId: string }> = {},
) {
  const fields = {
    content: VALID_CONTENT,
    articleId,
    ...overrides,
  };

  const formData = new FormData();
  formData.append("content", fields.content);
  formData.append("articleId", fields.articleId);
  return formData;
}

async function cleanup() {
  await prisma.comment.deleteMany({ where: { author: { email: USER_EMAIL } } });
  await prisma.article.deleteMany({ where: { author: { email: USER_EMAIL } } });
  await prisma.user.deleteMany({ where: { email: USER_EMAIL } });
}

beforeAll(async () => {
  await cleanup();

  const user = await prisma.user.create({
    data: {
      email: USER_EMAIL,
      username: "action_comment_user",
      password: "hash-non-utilise",
    },
  });
  userId = user.id;

  const article = await prisma.article.create({
    data: {
      title: "Article pour les tests de commentaires",
      content:
        "Contenu de l'article utilisé uniquement par les tests de l'action addComment.",
      authorId: userId,
    },
  });
  articleId = article.id;
});

afterAll(async () => {
  await cleanup();
  await prisma.$disconnect();
});

beforeEach(() => {
  vi.clearAllMocks();
  mockedAuth.mockResolvedValue({ user: { id: userId } });
});

describe("addComment : authentification", () => {
  it("devrait refuser un utilisateur non connecté", async () => {
    mockedAuth.mockResolvedValue(null);

    const result = await addComment(buildFormData());

    expect(result).toEqual({
      success: false,
      error: "Vous devez être connecté pour commenter",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("addComment : validation", () => {
  it.each([
    ["un commentaire vide", { content: "" }],
    ["un article non renseigné", { articleId: "" }],
  ])("devrait refuser %s", async (_label, overrides) => {
    const result = await addComment(buildFormData(overrides));

    expect(result).toMatchObject({
      success: false,
      error: expect.any(String),
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("addComment : succès", () => {
  it("devrait enregistrer le commentaire avec son auteur et son article", async () => {
    const result = await addComment(buildFormData());

    expect(result).toEqual({ success: true });

    const comment = await prisma.comment.findFirst({
      where: { articleId, authorId: userId },
    });

    expect(comment).not.toBeNull();
    expect(comment!.content).toBe(VALID_CONTENT);
    expect(revalidatePath).toHaveBeenCalledWith(`/articles/${articleId}`);
  });
});

describe("addComment : erreur inattendue", () => {
  it("devrait renvoyer une erreur générique si l'article n'existe pas", async () => {
    const result = await addComment(
      buildFormData({ articleId: "c000000000000000000000000" }),
    );

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de l'ajout du commentaire",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
