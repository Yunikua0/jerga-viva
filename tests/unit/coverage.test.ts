import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { slugify } from "../../src/lib/text";
import { CATEGORIES, wordSchema } from "../../src/lib/word-schema";

const headwords = JSON.parse(readFileSync("tests/fixtures/headwords.json", "utf8")) as Record<
  string,
  string[]
>;
const rawWords = JSON.parse(readFileSync("src/data/words.json", "utf8")) as unknown[];
const words = rawWords.map((w) => wordSchema.parse(w));
const expected = (process.env.EXPECT_CATEGORIES ?? "").split(",").filter(Boolean);

const allHeadwords = Object.values(headwords).flat();

describe("headword fixture", () => {
  it("has exactly the known categories", () => {
    expect(Object.keys(headwords).sort()).toEqual([...CATEGORIES].sort());
  });
  it("has exactly 25 headwords per category", () => {
    for (const category of Object.keys(headwords)) {
      expect(headwords[category]).toHaveLength(25);
    }
  });
  it("has no repeated ids across categories", () => {
    expect(new Set(allHeadwords).size).toBe(allHeadwords.length);
  });
});

describe("words.json", () => {
  it("has no repeated ids", () => {
    const ids = words.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("only contains headwords of its own category", () => {
    for (const word of words) {
      expect(headwords[word.category], `${word.id} (${word.category})`).toContain(word.id);
    }
  });
  it("derives the id from the term", () => {
    for (const word of words) {
      expect(slugify(word.term), word.id).toBe(word.id);
    }
  });
  it("only relates to known headwords other than itself", () => {
    for (const word of words) {
      for (const id of word.related) {
        expect(allHeadwords, `${word.id} -> ${id}`).toContain(id);
        expect(id, `${word.id} relates to itself`).not.toBe(word.id);
      }
    }
  });
});

describe("completeness", () => {
  it("only expects known categories", () => {
    for (const category of expected) {
      expect(CATEGORIES as readonly string[]).toContain(category);
    }
  });

  it.each(expected)("category %s has an entry for every headword", (category) => {
    const present = new Set(words.map((w) => w.id));
    const missing = (headwords[category] ?? []).filter((id) => !present.has(id));
    expect(missing).toEqual([]);
  });

  if (CATEGORIES.every((c) => expected.includes(c))) {
    it("every related id exists in words.json", () => {
      const present = new Set(words.map((w) => w.id));
      for (const word of words) {
        for (const id of word.related) {
          expect(present.has(id), `${word.id} -> ${id}`).toBe(true);
        }
      }
    });
  }
});
