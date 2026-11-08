import { test, expect } from "@playwright/test";

test.describe("Authentification", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("devrait permettre à un utilisateur de se connecter", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("password123");

    const responsePromise = page.waitForResponse((response) =>
      response.url().includes("/api/auth/callback/credentials"),
    );

    await page.getByRole("button", { name: "Se connecter" }).click();
    await responsePromise;

    await page.waitForURL("/feed");
    await expect(page).toHaveURL("/feed");
    await expect(page.getByRole("link", { name: "Articles" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Se déconnecter" }),
    ).toBeVisible();
  });

  test("devrait permettre à un nouvel utilisateur de s'inscrire", async ({
    page,
  }) => {
    const randomSuffix =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const uniqueEmail = `e2e_${randomSuffix}@mdd.dev`;
    const uniqueUsername = `e2e_user_${randomSuffix}`;

    console.log("📧 Email:", uniqueEmail, "| 👤 Username:", uniqueUsername);

    await page.goto("/register");

    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Nom d'utilisateur").fill(uniqueUsername);
    await page.getByLabel("Mot de passe").fill("SecurePassword123!");

    await page.getByRole("button", { name: "S'inscrire" }).click();

    await page.waitForURL("**/login", { timeout: 15000 });

    await expect(
      page.getByRole("heading", { name: "Connexion à MDD" }),
    ).toBeVisible();
  });

  test("devrait afficher une erreur avec de mauvais identifiants", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("mauvais_mot_de_passe");

    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(
      page.getByText("Email ou mot de passe incorrect."),
    ).toBeVisible();
  });
});
