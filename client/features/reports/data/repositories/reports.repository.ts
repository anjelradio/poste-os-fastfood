import { reportsApi } from "../api/reports-api";

export const reportsRepository = {
  getPurchasesReport(data: unknown) {
    return reportsApi.getPurchasesReport(data);
  },

  getPurchasesSummary(data: unknown) {
    return reportsApi.getPurchasesSummary(data);
  },

  getProfitsReport(data: unknown) {
    return reportsApi.getProfitsReport(data);
  },

  getProfitsSummary(data: unknown) {
    return reportsApi.getProfitsSummary(data);
  },

  getProductSalesReport(data: unknown) {
    return reportsApi.getProductSalesReport(data);
  },

  getProductSalesSummary(data: unknown) {
    return reportsApi.getProductSalesSummary(data);
  },
};
