import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import { errorResult } from "@/features/shared/data/infrastructure/api-error-result";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import {
  LogsListResponseSchema,
  type LogsListResponse,
} from "../schemas/logs/logs-list-response.schema";

const baseUrl = `${env.API_URL}/reports/logbook`;

export const logsApi = {
  async getLogs(
    page: number,
    pageSize: number,
    filters?: { area: string; date: string },
  ): Promise<ApiResult<LogsListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters?.area) {
      params.set("area", filters.area);
    }

    if (filters?.date) {
      params.set("date", filters.date);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/?${params.toString()}`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al obtener la bitacora.");
      }

      const responseData = await res.json();
      const parsedData = LogsListResponseSchema.safeParse(responseData);

      if (!parsedData.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedData.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },
};
