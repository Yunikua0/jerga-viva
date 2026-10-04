import { z } from "astro/zod";

export const CATEGORIES = [
  "redes-sociales",
  "gen-z",
  "internet-gaming",
  "relaciones-actitudes",
] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  "redes-sociales": "Redes sociales",
  "gen-z": "Gen Z",
  "internet-gaming": "Internet y gaming",
  "relaciones-actitudes": "Relaciones y actitudes",
};

export const SENSITIVITY = ["none", "mild", "strong"] as const;

export const wordSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  term: z.string().min(1).max(40),
  definition: z.string().min(20).max(220),
  examples: z.array(z.string().min(10).max(160)).length(2),
  origin: z.string().min(20).max(300),
  category: z.enum(CATEGORIES),
  related: z.array(z.string()).max(5).default([]),
  sensitivity: z.enum(SENSITIVITY).default("none"),
  reviewedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type Word = z.infer<typeof wordSchema>;
