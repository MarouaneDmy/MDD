import { test, expect } from "@playwright/test";

test.describe("Articles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("marouane@mdd.dev");
    await page.getByLabel("Mot de passe").fill("password123");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.waitForURL("/feed");
  });

  test("devrait afficher les articles du seed sur le feed", async ({
    page,
  }) => {
    await expect(
      page.getByText("Pourquoi TypeScript est incontournable"),
    ).toBeVisible();
    await expect(page.getByText("Les bases du Web3")).toBeVisible();
  });

  test("devrait permettre de créer un nouvel article", async ({ page }) => {
    await page.getByRole("link", { name: "Créer un article" }).click();
    await page.waitForURL("/articles/new");

    await page
      .getByLabel("Titre de l'article")
      .fill("Mon article Playwright E2E");
    await page
      .getByLabel("Contenu de l'article")
      .fill(
        "Ceci est un contenu de test généré par Playwright. Il contient plus de 50 caractères pour valider le schéma Zod avec succès.",
      );

    await page
      .locator("label")
      .filter({ has: page.getByText("JavaScript", { exact: true }) })
      .locator('input[type="checkbox"]')
      .check();

    await page.getByRole("button", { name: "Créer" }).click();

    await page.waitForURL(/\/articles\//);
    await expect(page.getByText("Mon article Playwright E2E")).toBeVisible();
    await expect(page.getByText("Ceci est un contenu de test")).toBeVisible();
  });

  test("devrait permettre de lire un article et d'ajouter un commentaire", async ({
    page,
  }) => {
    await page.getByText("Pourquoi TypeScript est incontournable").click();
    await page.waitForURL(/\/articles\//);

    await expect(
      page.getByText("TypeScript ajoute un typage statique"),
    ).toBeVisible();

    const commentText = "Commentaire de test E2E !";
    await page
      .getByPlaceholder("Écrivez ici votre commentaire")
      .fill(commentText);

    await page.getByRole("button", { name: "Envoyer le commentaire" }).click();

    await expect(
      page.locator("p").filter({ hasText: commentText }).first(),
    ).toBeVisible();
  });

  test("devrait trier les articles par plus anciens", async ({ page }) => {
    await page.locator('select[name="sort"]').selectOption("oldest");

    await page.waitForURL(/.*\?sort=oldest/);

    await expect(page.locator('select[name="sort"]')).toHaveValue("oldest");
  });
});
