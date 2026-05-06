import type { RawMaterial } from "../../domain/entities/raw-material";
import type { RawMaterialResponseDto } from "../schemas/raw-materials-list-response.schema";
import type { CreateRawMaterialRequest } from "../schemas/raw-material-request.schema";

export function toRawMaterialEntity(dto: RawMaterialResponseDto): RawMaterial {
  return {
    id: dto.id,
    name: dto.name,
    stock: dto.stock,
    minStock: dto.min_stock,
    measureUnit: dto.measure_unit,
    category: dto.category,
  };
}

export function toRawMaterialEntityList(dtos: RawMaterialResponseDto[]): RawMaterial[] {
  return dtos.map(toRawMaterialEntity);
}

export function toRawMaterialRequestDto(data: CreateRawMaterialRequest) {
  return {
    name: data.name,
    stock: data.stock,
    min_stock: data.minStock,
    measure_unit: data.measureUnit,
    category: data.category,
  };
}
