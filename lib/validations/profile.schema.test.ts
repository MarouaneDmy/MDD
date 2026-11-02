import { describe, it, expect } from "vitest";
import { profileSchema } from "./profile.schema";

describe("Test Unitaire : Schéma de validation Profil", () => {
  it("devrait valider une mise à jour de profil correcte (sans changement de mot de passe)", () => {
    const validData = {
      username: "nouveau_nom",
      email: "nouveau@mdd.dev",
      password: "",
    };

    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("devrait valider une mise à jour avec un nouveau mot de passe valide", () => {
    const validData = {
      username: "nouveau_nom",
      email: "nouveau@mdd.dev",
      password: "NouveauMotDePasse123!",
    };

    const result = profileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter un nom d'utilisateur trop court", () => {
    const invalidData = {
      username: "ab",
      email: "test@mdd.dev",
      password: "",
    };

    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("devrait rejeter un mot de passe trop court s'il est fourni", () => {
    const invalidData = {
      username: "test_user",
      email: "test@mdd.dev",
      password: "123",
    };

    const result = profileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
