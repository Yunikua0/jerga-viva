import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dayIndex, letterOf, slugify, truncate } from "../../src/lib/text";
import { wordSchema } from "../../src/lib/word-schema";

const viral = {
  id: "viral",
  term: "Viral",
  definition:
    "Contenido que se comparte tan rápido en redes que lo ve muchísima gente en poco tiempo.",
  examples: [
    "Ese video del perro bailando se hizo viral en una sola noche.",
    "Su tuit se volvió viral y ahora todo el mundo lo cita.",
  ],
  origin:
    "Viene de «virus»: la idea es que el contenido se contagia de una persona a otra, igual que un virus, pero a través de las redes sociales.",
  category: "redes-sociales",
  related: ["meme", "trending"],
  sensitivity: "none",
};

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Main character")).toBe("main-character");
  });
  it("strips accents", () => {
    expect(slugify("Cancelar")).toBe("cancelar");
  });
  it("strips punctuation and accents together", () => {
    expect(slugify("¡Está bueno!")).toBe("esta-bueno");
  });
  it("handles acronyms", () => {
    expect(slugify("POV")).toBe("pov");
  });
});

describe("letterOf", () => {
  it("returns the uppercase first letter", () => {
    expect(letterOf("POV")).toBe("P");
  });
  it("ignores accents", () => {
    expect(letterOf("Álgebra")).toBe("A");
  });
  it("returns # for non-letters", () => {
    expect(letterOf("123")).toBe("#");
  });
});

describe("truncate", () => {
  it("leaves short text untouched", () => {
    expect(truncate("hola", 10)).toBe("hola");
  });
  it("shortens long text to at most max characters ending in an ellipsis", () => {
    const result = truncate("a".repeat(300), 155);
    expect(result.length).toBeLessThanOrEqual(155);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("dayIndex", () => {
  it("is always within [0, length)", () => {
    for (const iso of ["1969-12-31T12:00:00Z", "2026-01-01T00:00:00Z", "2030-07-15T08:30:00Z"]) {
      const index = dayIndex(new Date(iso), 100);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(100);
    }
  });
  it("gives the same index for two instants of the same UTC day", () => {
    expect(dayIndex(new Date("2026-01-01T00:00:00Z"), 100)).toBe(
      dayIndex(new Date("2026-01-01T23:59:59Z"), 100),
    );
  });
  it("advances by one for consecutive days", () => {
    const d1 = new Date("2026-03-10T12:00:00Z");
    const d2 = new Date("2026-03-11T12:00:00Z");
    expect((dayIndex(d1, 100) + 1) % 100).toBe(dayIndex(d2, 100));
  });
});

describe("wordSchema", () => {
  it("accepts the viral entry", () => {
    expect(() => wordSchema.parse(viral)).not.toThrow();
  });
  it("rejects an entry with a single example", () => {
    expect(wordSchema.safeParse({ ...viral, examples: [viral.examples[0]] }).success).toBe(false);
  });
  it("rejects an id with uppercase letters", () => {
    expect(wordSchema.safeParse({ ...viral, id: "Viral" }).success).toBe(false);
  });
});

describe("words.json", () => {
  const words = JSON.parse(readFileSync("src/data/words.json", "utf8")) as Array<{
    id: string;
    term: string;
  }>;
  for (const word of words) {
    it(`entry "${word.id}" is valid and slugify(term) === id`, () => {
      expect(wordSchema.safeParse(word).success).toBe(true);
      expect(slugify(word.term)).toBe(word.id);
    });
  }
});
