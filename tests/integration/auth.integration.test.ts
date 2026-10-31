import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

describe("Test d'Intégration : Chaîne d'Authentification", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("devrait récupérer l'utilisateur du seed et valider son mot de passe avec bcrypt", async () => {
    const user = await prisma.user.findUnique({
      where: { email: "marouane@mdd.dev" },
    });

    expect(user).not.toBeNull();
    expect(user?.email).toBe("marouane@mdd.dev");
    expect(user?.username).toBe("marouane_dev");

    const plainTextPassword = "password123";
    const isPasswordValid = await bcrypt.compare(
      plainTextPassword,
      user!.password,
    );

    expect(isPasswordValid).toBe(true);
  });

  it("devrait échouer si le mot de passe est incorrect", async () => {
    const user = await prisma.user.findUnique({
      where: { email: "marouane@mdd.dev" },
    });

    const wrongPassword = "mauvais_mot_de_passe";
    const isPasswordValid = await bcrypt.compare(wrongPassword, user!.password);

    expect(isPasswordValid).toBe(false);
  });
});

describe("Test d'Intégration : Inscription et Contraintes DB", () => {
  // Nettoyage après le test pour ne pas polluer la DB
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: "tdd_test@mdd.dev" } });
    await prisma.$disconnect();
  });

  it("devrait créer un nouvel utilisateur et hacher son mot de passe", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const newUser = await prisma.user.create({
      data: {
        email: "tdd_test@mdd.dev",
        username: "tdd_user",
        password: hashedPassword,
      },
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe("tdd_test@mdd.dev");
    // On vérifie que le mot de passe en DB n'est PAS en clair
    expect(newUser.password).not.toBe("password123");
  });

  it("devrait échouer si l'email existe déjà (Unique Constraint)", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // On attend une erreur de Prisma (P2002: Unique constraint failed)
    await expect(
      prisma.user.create({
        data: {
          email: "tdd_test@mdd.dev", // Déjà créé dans le test précédent
          username: "tdd_user_duplicate",
          password: hashedPassword,
        },
      }),
    ).rejects.toThrow();
  });
});
