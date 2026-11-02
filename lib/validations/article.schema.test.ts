import { describe, it, expect } from "vitest";
import { articleSchema } from "./article.schema";

describe("Test Unitaire : Schéma de validation Article", () => {
  it("devrait valider un article correct", () => {
    const validData = {
      title: "Mon super article",
      content:
        "Ceci est un contenu d'article suffisamment long pour passer la validation",
      topicIds: ["topic1", "topic2"],
    };

    const result = articleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("devrait rejeter un titre trop court (min 5 caractères)", () => {
    const invalidData = {
      title: "Tit", // Trop court
      content: "Contenu valide et suffisamment long pour passer la validation",
      topicIds: ["topic1"],
    };

    const result = articleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("devrait rejeter un contenu trop court (min 50 caractères)", () => {
    const invalidData = {
      title: "Titre valide",
      content: "Trop court",
      topicIds: ["topic1"],
    };

    const result = articleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("devrait rejeter un article sans thème", () => {
    const invalidData = {
      title: "Titre valide",
      content: "Contenu valide et suffisamment long pour passer la validation",
      topicIds: [],
    };

    const result = articleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
