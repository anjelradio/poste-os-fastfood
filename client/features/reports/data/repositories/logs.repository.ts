import { logsApi } from "../api/logs-api";
import type { LogsFilters } from "../mappers/log.mapper";

export const logsRepository = {
  getLogs(page: number, pageSize: number, filters?: LogsFilters) {
    return logsApi.getLogs(page, pageSize, filters);
  },
};
