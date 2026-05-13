import type { Supplier } from "../../domain/entities/supplier";
import { CreateSupplierRequest } from "../schemas/supplier-request.schema";
import { SupplierResponseDto } from "../schemas/supplier-response.schema";

export function toSupplierEntity(dto: SupplierResponseDto): Supplier {
  return {
    id: dto.id,
    businessName: dto.business_name,
    contactName: dto.contact_name,
    phone: dto.phone,
    email: dto.email,
  };
}

export function toSupplierEntityList(dtos: SupplierResponseDto[]): Supplier[] {
  return dtos.map(toSupplierEntity);
}

export function toSupplierRequestDto(data: CreateSupplierRequest) {
  return {
    business_name: data.businessName,
    contact_name: data.contactName,
    phone: data.phone,
    email: data.email,
  };
}