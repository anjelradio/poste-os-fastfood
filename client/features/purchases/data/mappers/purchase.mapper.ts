import type { Purchase } from "../../domain/entities/purchase";
import type { PurchaseRequest } from "../schemas/purchase-request.schema";
import type {
  PurchaseResponseDto,
  PurchasesListResponseDto,
} from "../schemas/purchases-list-response.schema";

export type PurchasesFilters = {
  date?: string;
};

export function toPurchaseEntity(dto: PurchaseResponseDto): Purchase {
  return {
    id: dto.id,
    description: dto.description,
    supplierId: dto.supplier_id,
    supplierName: dto.supplier_name,
    purchasedAt: dto.purchased_at,
    total: dto.total,
    items: dto.items.map((item) => ({
      id: item.id,
      rawMaterialId: item.raw_material_id,
      rawMaterialName: item.raw_material_name,
      measureUnit: item.measure_unit,
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
  };
}

export function toPurchasesListEntity(dto: PurchasesListResponseDto) {
  return {
    purchases: dto.purchases.map(toPurchaseEntity),
    total: dto.total,
  };
}

export function toPurchasesQueryParams(input: {
  page: number;
  pageSize: number;
  filters?: PurchasesFilters;
}) {
  const params = new URLSearchParams({
    page: input.page.toString(),
    page_size: input.pageSize.toString(),
  });

  if (input.filters?.date) {
    params.set("date", input.filters.date);
  }

  return params;
}

export function toPurchasesSearchQuery(filters?: PurchasesFilters) {
  const params = new URLSearchParams();

  if (filters?.date) {
    params.set("date", filters.date);
  }

  return params;
}

export function toPurchaseRequestDto(data: PurchaseRequest) {
  return {
    supplier_id: data.supplierId,
    description: data.description ?? "",
    items: data.items.map((item) => ({
      raw_material_id: item.rawMaterialId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
  };
}
