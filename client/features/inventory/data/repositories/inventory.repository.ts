import { inventoryApi } from "../api/inventory-api";

export const inventoryRepository = {
  getMeasureUnits() {
    return inventoryApi.getMeasureUnits();
  },

  getRawMaterials() {
    return inventoryApi.getRawMaterials();
  },

  getRawMaterialById(id: number) {
    return inventoryApi.getRawMaterialById(id);
  },

  createRawMaterial(data: unknown) {
    return inventoryApi.createRawMaterial(data);
  },

  updateRawMaterial(id: number, data: unknown) {
    return inventoryApi.updateRawMaterial(id, data);
  },

  deleteRawMaterial(id: number) {
    return inventoryApi.deleteRawMaterial(id);
  },
};
