import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Test d'Intégration : Création d'Article", () => {
  let testUserId: string;
  let testTopicId: string;

  beforeAll(async () => {
    // Créer un utilisateur de test
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test_article@mdd.dev",
        username: "test_article_user",
        password: hashedPassword,
      },
    });
    testUserId = user.id;

    // Récupérer un thème existant
    const topic = await prisma.topic.findFirst();
    if (topic) {
      testTopicId = topic.id;
    }
  });

  afterAll(async () => {
    // Nettoyage
    await prisma.article.deleteMany({ where: { authorId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("devrait créer un article avec succès", async () => {
    const article = await prisma.article.create({
      data: {
        title: "Article de test pour intégration",
        content:
          "Ceci est le contenu de l'article de test. Il est suffisamment long pour passer la validation.",
        authorId: testUserId,
        topics: {
          create: [{ topicId: testTopicId }],
        },
      },
    });

    expect(article.id).toBeDefined();
    expect(article.title).toBe("Article de test pour intégration");
    expect(article.authorId).toBe(testUserId);
  });

  it("devrait récupérer un article avec son auteur", async () => {
    const article = await prisma.article.findFirst({
      where: { authorId: testUserId },
      include: {
        author: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    expect(article).not.toBeNull();
    expect(article?.author.username).toBe("test_article_user");
  });
});
