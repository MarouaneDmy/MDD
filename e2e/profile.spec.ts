import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.describe("Profil Utilisateur", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/e-mail/i).fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("Password123!");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL("/feed");
  });

  test.afterEach(async () => {
    await prisma.user.update({
      where: { email: "marouane@mdd.dev" },
      data: { username: "marouane_dev" },
    });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("devrait permettre de modifier son nom d'utilisateur", async ({
    page,
  }) => {
    await page.getByRole("link", { name: /profil/i }).click();
    await page.waitForURL("/profile");

    const usernameInput = page.getByLabel("Username");
    await usernameInput.clear();
    await usernameInput.fill("marouane_e2e_test");

    await page.getByRole("button", { name: "Sauvegarder" }).click();

    await expect(
      page.getByText("Profil mis à jour avec succès !"),
    ).toBeVisible();

    await expect(usernameInput).toHaveValue("marouane_e2e_test");
  });
});
