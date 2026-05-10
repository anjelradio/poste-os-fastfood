import { z } from "zod";

export const RecipeItemSchema = z.object({
  rawMaterialId: z.number(),
  rawMaterialName: z.string(),
  measureUnitId: z.number(),
  measureUnitName: z.string(),
  quantity: z.number(),
});

export const RecipeItemsSchema = z.array(RecipeItemSchema);

export type RecipeItem = z.infer<typeof RecipeItemSchema>;
