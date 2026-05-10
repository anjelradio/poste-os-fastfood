"use server";

import { revalidatePath } from "next/cache";
import { productsRepository } from "../../data/repositories/products.repository";
import type { ProductsFilters } from "../../data/mappers/product.mapper";

export async function getProductsAction(
  page: number,
  pageSize: number,
  filters?: ProductsFilters,
) {
  return productsRepository.getProducts(page, pageSize, filters);
}

export async function getProductByIdAction(id: number) {
  return productsRepository.getProductById(id);
}

export async function createProductAction(data: unknown) {
  const response = await productsRepository.createProduct(data);

  if (response.ok) {
    revalidatePath("/administracion/productos");
  }

  return response;
}

export async function updateProductAction(id: number, data: unknown) {
  const response = await productsRepository.updateProduct(id, data);

  if (response.ok) {
    revalidatePath("/administracion/productos");
  }

  return response;
}

export async function deleteProductAction(id: number) {
  const response = await productsRepository.deleteProduct(id);

  if (response.ok) {
    revalidatePath("/administracion/productos");
  }

  return response;
}
