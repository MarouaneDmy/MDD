import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Test d'Intégration : Commentaires", () => {
  let testUserId: string;
  let testArticleId: string;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test_comment@mdd.dev",
        username: "test_comment_user",
        password: hashedPassword,
      },
    });
    testUserId = user.id;

    const topic = await prisma.topic.findFirst();
    const article = await prisma.article.create({
      data: {
        title: "Article pour test commentaires",
        content: "Contenu de l'article pour tester les commentaires",
        authorId: testUserId,
        topics: {
          create: [{ topicId: topic!.id }],
        },
      },
    });
    testArticleId = article.id;
  });

  afterAll(async () => {
    await prisma.comment.deleteMany({ where: { authorId: testUserId } });
    await prisma.article.deleteMany({ where: { authorId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("devrait créer un commentaire avec succès", async () => {
    const comment = await prisma.comment.create({
      data: {
        content: "Super article de test !",
        authorId: testUserId,
        articleId: testArticleId,
      },
    });

    expect(comment.id).toBeDefined();
    expect(comment.content).toBe("Super article de test !");
  });

  it("devrait récupérer les commentaires d'un article avec leurs auteurs", async () => {
    const comments = await prisma.comment.findMany({
      where: { articleId: testArticleId },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].author.username).toBe("test_comment_user");
  });
});
