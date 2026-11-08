import { test, expect } from "@playwright/test";

test.describe("Profil Utilisateur", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("password123");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL("/feed");
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
