import { productsApi } from "../api/products-api";

export const productsRepository = {
  getProducts(
    page: number,
    pageSize: number,
    filters?: { productName: string; category: string },
  ) {
    return productsApi.getProducts(page, pageSize, filters);
  },

  getProductById(id: number) {
    return productsApi.getProductById(id);
  },

  getProductsByCategory(categorySlug: string) {
    return productsApi.getProductsByCategory(categorySlug);
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
