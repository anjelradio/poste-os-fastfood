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
import { Supplier } from "../../domain/entities/supplier";
import { SuppliersListResponseSchema } from "../schemas/supplier-list-request.schema";
import { toSupplierEntity, toSupplierEntityList, toSupplierRequestDto } from "../mappers/supplier.mapper";
import { SupplierResponseDtoSchema } from "../schemas/supplier-response.schema";
import { CreateSupplierRequestSchema, UpdateSupplierRequestSchema } from "../schemas/supplier-request.schema";



const baseUrl = `${env.API_URL}/purchases/suppliers`;

export const suppliersApi = {
  async getSuppliers(): Promise<ApiResult<Supplier[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener los proveedores.",
      responseSchema: SuppliersListResponseSchema,
      mapData: toSupplierEntityList,
    });
  },

  async getSupplierById(id: number): Promise<ApiMaybeResult<Supplier>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener el proveedor.",
      responseSchema: SupplierResponseDtoSchema,
      mapData: toSupplierEntity,
    });
  },

  async createSupplier(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(CreateSupplierRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/`,
      method: "POST",
      token: token ?? undefined,
      body: toSupplierRequestDto(input.data),
      fallbackMessage: "Error al crear el proveedor.",
    });
  },

  async updateSupplier(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(UpdateSupplierRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toSupplierRequestDto(input.data),
      fallbackMessage: "Error al actualizar el proveedor.",
    });
  },

  async deleteSupplier(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar el proveedor.",
    });
  },
};