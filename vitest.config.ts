import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // Environnement Node.js pour les tests d'intégration (Prisma, etc.)
    environment: "node",
    // Inclure tous les fichiers de test
    include: ["**/*.test.ts"],
    // Exclure les tests E2E de Playwright (ils ont leur propre runner)
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
