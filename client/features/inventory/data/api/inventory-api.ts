import { env } from "@/lib/config/env";
import { apiRequestJson } from "@/features/shared/data/infrastructure/api/api-client";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import type { MeasureUnit } from "../../domain/entities/measure-unit";
import type { RawMaterial } from "../../domain/entities/raw-material";
import {
  MeasureUnitsListResponseSchema,
} from "../schemas/measure-units-list-response.schema";
import {
  RawMaterialsListResponseSchema,
} from "../schemas/raw-materials-list-response.schema";

const baseUrl = `${env.API_URL}/inventory`;

export const inventoryApi = {
  async getMeasureUnits(): Promise<ApiResult<MeasureUnit[]>> {
    return apiRequestJson({
      url: `${baseUrl}/measure-units/`,
      method: "GET",
      cache: "no-store",
      fallbackMessage: "Error al obtener las unidades de medida.",
      responseSchema: MeasureUnitsListResponseSchema,
    });
  },

  async getRawMaterials(): Promise<ApiResult<RawMaterial[]>> {
    return apiRequestJson({
      url: `${baseUrl}/raw-materials/`,
      method: "GET",
      cache: "no-store",
      fallbackMessage: "Error al obtener las materias primas.",
      responseSchema: RawMaterialsListResponseSchema,
    });
  },
};
