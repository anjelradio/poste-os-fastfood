import { z } from "zod";
import { ProductSchema } from "../../domain/entities/product";

export const ProductsListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
});

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
