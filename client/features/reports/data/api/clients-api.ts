import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestJson,
  apiRequestMaybeJson,
} from "@/features/shared/data/infrastructure/api/api-client";
import type { ApiMaybeResult, ApiResult } from "@/features/shared/data/types/api-result";
import type { Client } from "../../domain/entities/client";
import { toClientEntity, toClientEntityList } from "../mappers/client.mapper";
import {
  ClientResponseDtoSchema,
  ClientsListResponseSchema,
} from "../schemas/clients/clients-list-response.schema";

const baseUrl = `${env.API_URL}/reports/clients`;

export const clientsApi = {
  async getClients(): Promise<ApiResult<Client[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener los clientes.",
      responseSchema: ClientsListResponseSchema,
      mapData: toClientEntityList,
    });
  },

  async getClientById(id: number): Promise<ApiMaybeResult<Client>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener el cliente.",
      responseSchema: ClientResponseDtoSchema,
      mapData: toClientEntity,
    });
  },
};
