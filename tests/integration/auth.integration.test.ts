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
