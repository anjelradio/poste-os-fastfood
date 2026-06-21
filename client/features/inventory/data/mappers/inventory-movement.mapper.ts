import type { InventoryMovement } from "../../domain/entities/inventory-movement";
import type { InventoryMovementResponseDto } from "../schemas/inventory-movement-response.schema";

export function toInventoryMovementEntity(dto: InventoryMovementResponseDto): InventoryMovement {
  return {
    id: dto.id,
    rawMaterialName: dto.raw_material_name,
    quantity: dto.quantity,
    movementType: dto.movement_type,
    movementTypeDisplay: dto.movement_type_display,
    reason: dto.reason,
    createdAt: dto.created_at,
  };
}

export function toInventoryMovementEntityList(dtoList: InventoryMovementResponseDto[]): InventoryMovement[] {
  return dtoList.map(toInventoryMovementEntity);
}
