import { z } from "zod";

export const PurchaseItemRequestSchema = z.object({
  rawMaterialId: z.coerce.number().int().positive("Materia prima inválida"),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0"),
  unitPrice: z.coerce.number().positive("El precio unitario debe ser mayor a 0"),
});

export const PurchaseRequestSchema = z.object({
  supplierId: z.coerce.number().int().positive("El proveedor es obligatorio"),
  description: z.string().max(255).optional().default(""),
  items: z.array(PurchaseItemRequestSchema).min(1, "Agrega al menos una materia prima"),
});

export type PurchaseRequest = z.infer<typeof PurchaseRequestSchema>;
