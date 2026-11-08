import { describe, it, expect } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("devrait formater un objet Date en français", () => {
    expect(formatDate(new Date(2026, 10, 2))).toBe("2 novembre 2026");
  });

  it("devrait formater une chaîne ISO", () => {
    // Midi UTC : la date reste la même quel que soit le fuseau horaire
    expect(formatDate("2026-11-02T12:00:00Z")).toBe("2 novembre 2026");
  });

  it("devrait donner le même résultat pour une Date et pour sa chaîne ISO", () => {
    const date = new Date(2026, 5, 15, 12, 0, 0);

    expect(formatDate(date)).toBe(formatDate(date.toISOString()));
  });

  it("devrait écrire le mois en toutes lettres, avec ses accents", () => {
    expect(formatDate(new Date(2026, 11, 25))).toBe("25 décembre 2026");
    expect(formatDate(new Date(2026, 1, 14))).toBe("14 février 2026");
  });

  it("ne devrait pas ajouter de zéro devant le jour", () => {
    expect(formatDate(new Date(2026, 2, 5))).toBe("5 mars 2026");
  });

  it("devrait lever une erreur pour une date invalide", () => {
    expect(() => formatDate("pas une date")).toThrow(RangeError);
  });
});
