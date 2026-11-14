import { describe, it, expect } from "vitest";
import { passwordSchema, optionalPasswordSchema } from "./password.schema";
import { PASSWORD_RULES } from "./password-rules";

describe("passwordSchema", () => {
  it("devrait accepter un mot de passe qui respecte toutes les règles", () => {
    expect(passwordSchema.safeParse("Password123!").success).toBe(true);
  });

  it.each([
    ["trop court", "Ab1!", "8 caractères"],
    ["sans majuscule", "password123!", "majuscule"],
    ["sans chiffre", "Password!!!", "chiffre"],
    ["sans caractère spécial", "Password123", "spécial"],
  ])("devrait refuser un mot de passe %s", (_label, value, expected) => {
    const result = passwordSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((i) => i.message)).toEqual([
        expect.stringContaining(expected),
      ]);
    }
  });

  it("devrait signaler toutes les règles non respectées en une fois", () => {
    const result = passwordSchema.safeParse("abc");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(4);
    }
  });

  it.each(["Abcdefg1!", "Abcdefg1_", "Abcdefg1#", "Abcdefg1?", "Abcdefg1-"])(
    "devrait accepter %s comme caractère spécial",
    (value) => {
      expect(passwordSchema.safeParse(value).success).toBe(true);
    },
  );

  it("ne devrait pas considérer une lettre accentuée comme un caractère spécial", () => {
    expect(passwordSchema.safeParse("Abcdefg1é").success).toBe(false);
  });
});

describe("optionalPasswordSchema", () => {
  it.each(["", undefined])("devrait accepter une valeur vide (%s)", (value) => {
    expect(optionalPasswordSchema.safeParse(value).success).toBe(true);
  });

  it("devrait accepter un mot de passe valide", () => {
    expect(optionalPasswordSchema.safeParse("Password123!").success).toBe(true);
  });

  it("devrait refuser un mot de passe renseigné mais trop faible", () => {
    expect(optionalPasswordSchema.safeParse("faible").success).toBe(false);
  });
});

describe("PASSWORD_RULES", () => {
  it("devrait être respectée par un mot de passe valide", () => {
    expect(PASSWORD_RULES.every((rule) => rule.test("Password123!"))).toBe(
      true,
    );
  });
});
