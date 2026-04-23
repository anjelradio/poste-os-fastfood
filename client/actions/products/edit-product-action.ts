"use server";

import { updateProductAction } from "@/features/products/presentation/actions/product-actions";

export async function editProduct(data: unknown, id: number) {
  const response = await updateProductAction(id, data);

  if (response.ok) {
    return response;
  }

  return {
    ok: false,
    errors: response.validationErrors ?? { non_field_errors: response.errors },
  };
}
