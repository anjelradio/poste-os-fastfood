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
import type { MeasureUnit } from "../../domain/entities/measure-unit";
import type { RawMaterial } from "../../domain/entities/raw-material";
import {
  MeasureUnitsListResponseSchema,
} from "../schemas/measure-units-list-response.schema";
import {
  RawMaterialResponseDtoSchema,
  RawMaterialsListResponseSchema,
} from "../schemas/raw-materials-list-response.schema";
import {
  CreateRawMaterialRequestSchema,
  UpdateRawMaterialRequestSchema,
} from "../schemas/raw-material-request.schema";
import {
  toRawMaterialEntity,
  toRawMaterialEntityList,
  toRawMaterialRequestDto,
} from "../mappers/raw-material.mapper";

const baseUrl = `${env.API_URL}/inventory`;

export const inventoryApi = {
  async getMeasureUnits(): Promise<ApiResult<MeasureUnit[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/measure-units/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener las unidades de medida.",
      responseSchema: MeasureUnitsListResponseSchema,
    });
  },

  async getRawMaterials(): Promise<ApiResult<RawMaterial[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/raw-materials/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener las materias primas.",
      responseSchema: RawMaterialsListResponseSchema,
      mapData: toRawMaterialEntityList,
    });
  },

  async getRawMaterialById(id: number): Promise<ApiMaybeResult<RawMaterial>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/raw-materials/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener la materia prima.",
      responseSchema: RawMaterialResponseDtoSchema,
      mapData: toRawMaterialEntity,
    });
  },

  async createRawMaterial(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(CreateRawMaterialRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/raw-materials/`,
      method: "POST",
      token: token ?? undefined,
      body: toRawMaterialRequestDto(input.data),
      fallbackMessage: "Error al crear la materia prima.",
    });
  },

  async updateRawMaterial(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(UpdateRawMaterialRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/raw-materials/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toRawMaterialRequestDto(input.data),
      fallbackMessage: "Error al actualizar la materia prima.",
    });
  },

  async deleteRawMaterial(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/raw-materials/${id}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar la materia prima.",
    });
  },
};
