import { z } from "zod";
import { CategorySchema } from "./category";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  image: z.string().nullable(),
  slug: z.string(),
  hasRecipe: z.boolean(),
  category: CategorySchema,
});

// Types
export type Product = z.infer<typeof ProductSchema>;
