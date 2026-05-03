import { inventoryApi } from "../api/inventory-api";

export const inventoryRepository = {
  getMeasureUnits() {
    return inventoryApi.getMeasureUnits();
  },

  getRawMaterials() {
    return inventoryApi.getRawMaterials();
  },
};
