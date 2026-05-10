import type { RecipeItem } from "../../domain/entities/recipe-item";
import type { SaveRecipeRequest } from "../schemas/recipe-request.schema";
import type { RecipeItemResponseDto } from "../schemas/recipe-response.schema";

export function toRecipeItemEntity(dto: RecipeItemResponseDto): RecipeItem {
  return {
    rawMaterialId: dto.raw_material_id,
    rawMaterialName: dto.raw_material_name,
    measureUnitId: dto.measure_unit_id,
    measureUnitName: dto.measure_unit_name,
    quantity: Number(dto.quantity),
  };
}

export function toRecipeItemsEntity(dtos: RecipeItemResponseDto[]): RecipeItem[] {
  return dtos.map(toRecipeItemEntity);
}

export function toSaveRecipeRequestDto(data: SaveRecipeRequest) {
  return {
    items: data.items.map((item) => ({
      raw_material: item.rawMaterialId,
      measure_unit: item.measureUnitId,
      quantity: item.quantity,
    })),
  };
}
