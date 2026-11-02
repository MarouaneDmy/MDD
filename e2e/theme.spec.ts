import { test, expect } from "@playwright/test";

test.describe("Gestion des Thèmes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("password123");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL("/feed");
  });

  test("devrait permettre de s'abonner à un thème", async ({ page }) => {
    await page.goto("/themes");

    const themeCard = page.locator("article", {
      hasText: "JavaScript", // On utilise JavaScript qui semble avoir un état incertain
    });

    const unsubscribeBtn = themeCard.getByRole("button", {
      name: "Déjà abonné",
    });
    if (await unsubscribeBtn.isVisible()) {
      await unsubscribeBtn.click();
      // Attendre que le bouton redevienne "S'abonner"
      await expect(
        themeCard.getByRole("button", { name: "S'abonner" }),
      ).toBeVisible({ timeout: 3000 });
    }

    // ÉTAPE 1 : Maintenant on peut s'abonner proprement
    const subscribeBtn = themeCard.getByRole("button", { name: "S'abonner" });
    await expect(subscribeBtn).toBeVisible();
    await subscribeBtn.click();

    // ÉTAPE 2 : Vérifier le changement d'état
    await expect(
      themeCard.getByRole("button", { name: "Déjà abonné" }),
    ).toBeVisible();
  });
});
