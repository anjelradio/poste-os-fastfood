import type { Log } from "../../domain/entities/log";
import type { LogResponseDto } from "../schemas/logs/log-response.schema";

export type LogsFilters = {
  area?: string;
  date?: string;
};

export function toLogEntity(dto: LogResponseDto): Log {
  return {
    id: dto.id,
    createdDate: dto.created_date,
    time: dto.time,
    area: dto.area,
    user: dto.user,
    action: dto.action,
    description: dto.description,
    ipAddress: dto.ip_address,
  };
}

export function toLogEntityList(dtos: LogResponseDto[]): Log[] {
  return dtos.map(toLogEntity);
}

export function toLogsQueryParams(input: {
  page: number;
  pageSize: number;
  filters?: LogsFilters;
}) {
  const params = new URLSearchParams({
    page: input.page.toString(),
    page_size: input.pageSize.toString(),
  });

  if (input.filters?.area) {
    params.set("area", input.filters.area);
  }

  if (input.filters?.date) {
    params.set("date", input.filters.date);
  }

  return params;
}

export function toLogsSearchQuery(filters?: LogsFilters) {
  const params = new URLSearchParams();

  if (filters?.area) {
    params.set("area", filters.area);
  }

  if (filters?.date) {
    params.set("date", filters.date);
  }

  return params;
}
