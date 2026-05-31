import { reportsApi } from "../api/reports-api";

export const reportsRepository = {
  getPurchasesReport(data: unknown) {
    return reportsApi.getPurchasesReport(data);
  },

  getProfitsReport(data: unknown) {
    return reportsApi.getProfitsReport(data);
  },

  getProductSalesReport(data: unknown) {
    return reportsApi.getProductSalesReport(data);
  },
};
