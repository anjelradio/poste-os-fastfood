"use server";

import { deleteProductAction } from "@/features/products/presentation/actions/product-actions";

export async function deleteProduct(id: number) {
  const response = await deleteProductAction(id);

  if (response.ok) {
    return response;
  }

  return {
    ok: false,
    error: response.errors[0] ?? "Error al eliminar el producto",
  };
}
