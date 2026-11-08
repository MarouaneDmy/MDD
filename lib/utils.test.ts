import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("devrait assembler plusieurs classes", () => {
    expect(cn("text-sm", "font-bold")).toBe("text-sm font-bold");
  });

  it("devrait ignorer les valeurs vides ou fausses", () => {
    expect(cn("a", false, null, undefined, "")).toBe("a");
  });

  it("devrait gérer les classes conditionnelles sous forme d'objet", () => {
    expect(cn({ "bg-primary": true, hidden: false })).toBe("bg-primary");
  });

  it("devrait gérer les tableaux de classes", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("devrait renvoyer une chaîne vide sans argument", () => {
    expect(cn()).toBe("");
  });

  it("devrait garder la dernière classe quand deux classes Tailwind sont en conflit", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("bg-primary", "bg-gray-300")).toBe("bg-gray-300");
  });

  it("ne devrait pas confondre les variantes responsive avec la classe de base", () => {
    const result = cn("px-4 md:px-10", "px-6");

    expect(result).toContain("md:px-10");
    expect(result).toContain("px-6");
    expect(result).not.toContain("px-4");
  });
});
