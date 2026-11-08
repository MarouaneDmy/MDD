import type { Page } from "@playwright/test";

export async function login(
  page: Page,
  identifier = "marouane@mdd.dev",
  password = "password123",
) {
  await page.goto("/login");
  await page.getByLabel(/e-mail/i).fill(identifier);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await page.waitForURL("/feed");
}
