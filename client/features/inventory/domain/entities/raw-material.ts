import { z } from "zod";

const RawMaterialCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const RawMaterialSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock: z.string(),
  minStock: z.string(),
  measureUnit: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
  }),
  category: RawMaterialCategorySchema,
});

export type RawMaterial = z.infer<typeof RawMaterialSchema>;
