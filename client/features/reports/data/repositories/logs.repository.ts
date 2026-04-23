import { logsApi } from "../api/logs-api";

export const logsRepository = {
  getLogs(page: number, pageSize: number, filters?: { area: string; date: string }) {
    return logsApi.getLogs(page, pageSize, filters);
  },
};
