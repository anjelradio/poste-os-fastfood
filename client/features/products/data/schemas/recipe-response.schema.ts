import { z } from "zod";

export const RecipeItemResponseDtoSchema = z.object({
  id: z.number(),
  raw_material_id: z.number(),
  raw_material_name: z.string(),
  measure_unit_id: z.number(),
  measure_unit_name: z.string(),
  quantity: z.string().or(z.number()),
});

export const RecipeResponseDtoSchema = z.object({
  items: z.array(RecipeItemResponseDtoSchema),
});

export type RecipeItemResponseDto = z.infer<typeof RecipeItemResponseDtoSchema>;
