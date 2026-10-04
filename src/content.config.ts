import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { wordSchema } from "./lib/word-schema";

const words = defineCollection({
  loader: file("src/data/words.json"),
  schema: wordSchema,
});

export const collections = { words };
