import { z } from "zod";

export const InventoryMovementSchema = z.object({
  id: z.number(),
  rawMaterialName: z.string(),
  quantity: z.string(),
  movementType: z.string(),
  movementTypeDisplay: z.string(),
  reason: z.string(),
  createdAt: z.string(),
});

export type InventoryMovement = z.infer<typeof InventoryMovementSchema>;
