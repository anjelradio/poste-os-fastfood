import { productsApi } from "../api/products-api";
import type { ProductsFilters, TopSoldFilters } from "../mappers/product.mapper";

export const productsRepository = {
  getProducts(
    page: number,
    pageSize: number,
    filters?: ProductsFilters,
  ) {
    return productsApi.getProducts(page, pageSize, filters);
  },

  getProductById(id: number) {
    return productsApi.getProductById(id);
  },

  getProductsByCategory(categorySlug: string) {
    return productsApi.getProductsByCategory(categorySlug);
  },

  getTopSoldProductsSummary() {
    return productsApi.getTopSoldProductsSummary();
  },

  getTopSoldProductsList(filters: TopSoldFilters) {
    return productsApi.getTopSoldProductsList(filters);
  },

  createProduct(data: unknown) {
    return productsApi.createProduct(data);
  },

  updateProduct(id: number, data: unknown) {
    return productsApi.updateProduct(id, data);
  },

  deleteProduct(id: number) {
    return productsApi.deleteProduct(id);
  },
};
