import { describe, it, expect } from "vitest";
import { commentSchema } from "./comment.schema";

describe("Test Unitaire : Schéma de validation Commentaire", () => {
  it("devrait valider un commentaire correct", () => {
    const validData = {
      content: "Super article, merci pour le partage !",
      articleId: "clx1234567890",
    };

    const result = commentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter un commentaire vide", () => {
    const invalidData = {
      content: "",
      articleId: "clx1234567890",
    };

    const result = commentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("devrait rejeter un commentaire trop long (max 1000 caractères)", () => {
    const invalidData = {
      content: "a".repeat(1001),
      articleId: "clx1234567890",
    };

    const result = commentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
