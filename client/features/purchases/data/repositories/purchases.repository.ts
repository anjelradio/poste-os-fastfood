import { purchasesApi } from "../api/purchases-api";
import type { PurchasesFilters } from "../mappers/purchase.mapper";

export const purchasesRepository = {
  getPurchases(page: number, pageSize: number, filters?: PurchasesFilters) {
    return purchasesApi.getPurchases(page, pageSize, filters);
  },

  getPurchaseById(id: number) {
    return purchasesApi.getPurchaseById(id);
  },

  createPurchase(data: unknown) {
    return purchasesApi.createPurchase(data);
  },

  updatePurchase(id: number, data: unknown) {
    return purchasesApi.updatePurchase(id, data);
  },

  deletePurchase(id: number) {
    return purchasesApi.deletePurchase(id);
  },
};
