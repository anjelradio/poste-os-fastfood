import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  type: z.enum(["PRODUCT", "RAW_MATERIAL"]),
});

export const CategoryListSchema = z.array(CategorySchema)


// Types
export type Category = z.infer<typeof CategorySchema>
