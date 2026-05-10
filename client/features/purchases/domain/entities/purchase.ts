import { z } from "zod";

export const PurchaseItemSchema = z.object({
  id: z.number(),
  rawMaterialId: z.number(),
  rawMaterialName: z.string(),
  measureUnit: z.string(),
  quantity: z.string().or(z.number()),
  unitPrice: z.string().or(z.number()),
});

export const PurchaseSchema = z.object({
  id: z.number(),
  description: z.string(),
  supplierId: z.number(),
  supplierName: z.string(),
  purchasedAt: z.string(),
  total: z.string().or(z.number()),
  items: z.array(PurchaseItemSchema),
});

export type Purchase = z.infer<typeof PurchaseSchema>;
