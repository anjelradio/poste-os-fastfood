import { z } from "zod";

const PurchaseItemResponseDtoSchema = z.object({
  id: z.number(),
  raw_material_id: z.number(),
  raw_material_name: z.string(),
  measure_unit: z.string(),
  quantity: z.string().or(z.number()),
  unit_price: z.string().or(z.number()),
});

const PurchaseResponseDtoSchema = z.object({
  id: z.number(),
  description: z.string(),
  supplier_id: z.number(),
  supplier_name: z.string(),
  purchased_at: z.string(),
  total: z.string().or(z.number()),
  items: z.array(PurchaseItemResponseDtoSchema),
});

export const PurchasesListResponseSchema = z.object({
  purchases: z.array(PurchaseResponseDtoSchema),
  total: z.number(),
});

export type PurchaseResponseDto = z.infer<typeof PurchaseResponseDtoSchema>;
export type PurchasesListResponseDto = z.infer<typeof PurchasesListResponseSchema>;
