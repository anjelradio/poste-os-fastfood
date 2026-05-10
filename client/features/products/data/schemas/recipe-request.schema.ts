import { z } from "zod";

export const RecipeWriteItemSchema = z.object({
  rawMaterialId: z.coerce.number().int().positive(),
  measureUnitId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().positive(),
});

export const SaveRecipeRequestSchema = z.object({
  items: z.array(RecipeWriteItemSchema),
});

export type SaveRecipeRequest = z.infer<typeof SaveRecipeRequestSchema>;
