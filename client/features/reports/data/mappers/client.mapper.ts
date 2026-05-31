import type { Client } from "../../domain/entities/client";
import type { ClientResponseDto } from "../schemas/clients/clients-list-response.schema";

export function toClientEntity(dto: ClientResponseDto): Client {
  return {
    id: dto.id,
    name: dto.name,
    nit: dto.nit,
    createdDate: dto.created_date,
  };
}

export function toClientEntityList(dtos: ClientResponseDto[]): Client[] {
  return dtos.map(toClientEntity);
}
