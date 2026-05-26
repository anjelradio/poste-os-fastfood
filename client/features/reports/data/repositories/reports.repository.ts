import { reportsApi } from "../api/reports-api";

export const reportsRepository = {
  getPurchasesReport(data: unknown) {
    return reportsApi.getPurchasesReport(data);
  },
};
