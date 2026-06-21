import { z } from "zod";

export const InventoryMovementResponseDtoSchema = z.object({
  id: z.number(),
  raw_material_name: z.string(),
  quantity: z.string(),
  movement_type: z.string(),
  movement_type_display: z.string(),
  reason: z.string(),
  created_at: z.string(),
});

export const InventoryMovementsListResponseSchema = z.array(InventoryMovementResponseDtoSchema);

export type InventoryMovementResponseDto = z.infer<typeof InventoryMovementResponseDtoSchema>;
