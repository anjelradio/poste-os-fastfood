import { z } from "zod";
import { ProductResponseDtoSchema } from "./product-response.schema";

export const ProductsListResponseSchema = z.object({
  products: z.array(ProductResponseDtoSchema),
  total: z.number(),
});

export type ProductsListResponseDto = z.infer<typeof ProductsListResponseSchema>;
