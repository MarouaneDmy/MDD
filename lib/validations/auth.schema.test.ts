import { describe, it, expect } from "vitest";
import { loginSchema } from "./auth.schema";

describe("Test Unitaire : Schéma de validation Login", () => {
  it("devrait valider des identifiants corrects", () => {
    const validData = {
      email: "marouane@mdd.dev",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter un email invalide", () => {
    const invalidData = {
      email: "pas-un-email",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Adresse email invalide");
    }
  });

  it("devrait rejeter un mot de passe vide", () => {
    const invalidData = {
      email: "marouane@mdd.dev",
      password: "",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le mot de passe est requis");
    }
  });
});
