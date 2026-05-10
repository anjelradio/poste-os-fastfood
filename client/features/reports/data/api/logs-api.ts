import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import { apiRequestJson } from "@/features/shared/data/infrastructure/api/api-client";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import {
  toLogEntityList,
  toLogsQueryParams,
  type LogsFilters,
} from "../mappers/log.mapper";
import {
  LogsListResponseSchema,
  type LogsListResponseDto,
} from "../schemas/logs/logs-list-response.schema";

type LogsListResponse = {
  data: ReturnType<typeof toLogEntityList>;
  totalLogs: number;
};

const baseUrl = `${env.API_URL}/reports/logbook`;

export const logsApi = {
  async getLogs(
    page: number,
    pageSize: number,
    filters?: LogsFilters,
  ): Promise<ApiResult<LogsListResponse>> {
    const params = toLogsQueryParams({ page, pageSize, filters });

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener la bitacora.",
      responseSchema: LogsListResponseSchema,
      mapData: (dto: LogsListResponseDto) => ({
        data: toLogEntityList(dto.data),
        totalLogs: dto.total_logs,
      }),
    });
  },
};
