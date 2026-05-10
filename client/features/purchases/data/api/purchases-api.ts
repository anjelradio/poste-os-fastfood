import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestJson,
  apiRequestMaybeJson,
  apiRequestStatus,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type {
  ApiMaybeResult,
  ApiResult,
  ApiStatusResult,
} from "@/features/shared/data/types/api-result";
import {
  toPurchaseEntity,
  toPurchaseRequestDto,
  toPurchasesListEntity,
  toPurchasesQueryParams,
  type PurchasesFilters,
} from "../mappers/purchase.mapper";
import {
  type PurchaseResponseDto,
  PurchasesListResponseSchema,
  type PurchasesListResponseDto,
} from "../schemas/purchases-list-response.schema";
import type { Purchase } from "../../domain/entities/purchase";
import { PurchaseRequestSchema } from "../schemas/purchase-request.schema";

type PurchasesListResponse = {
  purchases: Purchase[];
  total: number;
};

const baseUrl = `${env.API_URL}/purchases`;

export const purchasesApi = {
  async getPurchases(
    page: number,
    pageSize: number,
    filters?: PurchasesFilters,
  ): Promise<ApiResult<PurchasesListResponse>> {
    const params = toPurchasesQueryParams({ page, pageSize, filters });
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener las compras.",
      responseSchema: PurchasesListResponseSchema,
      mapData: (dto: PurchasesListResponseDto) => toPurchasesListEntity(dto),
    });
  },

  async getPurchaseById(id: number): Promise<ApiMaybeResult<Purchase>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener la compra.",
      responseSchema: PurchasesListResponseSchema.shape.purchases.element,
      mapData: (dto: PurchaseResponseDto) => toPurchaseEntity(dto),
    });
  },

  async createPurchase(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(PurchaseRequestSchema, data);
    if (!input.ok) return input;

    const token = await getAccessToken();
    return apiRequestStatus({
      url: `${baseUrl}/`,
      method: "POST",
      token: token ?? undefined,
      body: toPurchaseRequestDto(input.data),
      fallbackMessage: "Error al crear la compra.",
    });
  },

  async updatePurchase(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(PurchaseRequestSchema, data);
    if (!input.ok) return input;

    const token = await getAccessToken();
    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toPurchaseRequestDto(input.data),
      fallbackMessage: "Error al actualizar la compra.",
    });
  },

  async deletePurchase(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar la compra.",
    });
  },
};
