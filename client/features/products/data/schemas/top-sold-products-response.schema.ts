import { z } from "zod";

export const TopSoldProductItemDtoSchema = z.object({
  productId: z.number(),
  name: z.string(),
  image: z.string().nullable(),
  quantitySold: z.number(),
  ordersCount: z.number(),
  revenue: z.union([z.string(), z.number()]),
});

export const TopSoldProductSummaryResponseSchema = z.object({
  item: TopSoldProductItemDtoSchema.nullable(),
  from_date: z.string(),
  to_date: z.string(),
});

export const TopSoldProductListResponseSchema = z.object({
  items: z.array(TopSoldProductItemDtoSchema),
  total: z.number(),
  from_date: z.string(),
  to_date: z.string(),
});

export type TopSoldProductItemDto = z.infer<typeof TopSoldProductItemDtoSchema>;
export type TopSoldProductSummaryResponseDto = z.infer<
  typeof TopSoldProductSummaryResponseSchema
>;
export type TopSoldProductListResponseDto = z.infer<
  typeof TopSoldProductListResponseSchema
>;
