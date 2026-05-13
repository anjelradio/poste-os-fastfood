import { suppliersApi } from "../api/suppliers-api";

export const suppliersRepository = {
  getSuppliers() {
    return suppliersApi.getSuppliers();
  },

  getSupplierById(id: number) {
    return suppliersApi.getSupplierById(id);
  },

  createSupplier(data: unknown) {
    return suppliersApi.createSupplier(data);
  },

  updateSupplier(id: number, data: unknown) {
    return suppliersApi.updateSupplier(id, data);
  },

  deleteSupplier(id: number) {
    return suppliersApi.deleteSupplier(id);
  },
};