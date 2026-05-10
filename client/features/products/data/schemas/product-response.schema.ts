import { z } from "zod";
import { CategorySchema } from "../../domain/entities/category";

export const ProductResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  image: z.string().nullable(),
  slug: z.string(),
  has_recipe: z.boolean(),
  category: CategorySchema,
});

export type ProductResponseDto = z.infer<typeof ProductResponseDtoSchema>;
