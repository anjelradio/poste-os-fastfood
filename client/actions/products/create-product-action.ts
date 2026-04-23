"use server";

import { createProductAction } from "@/features/products/presentation/actions/product-actions";

export async function createProduct(data: unknown) {
  const response = await createProductAction(data);

  if (response.ok) {
    return response;
  }

  return {
    ok: false,
    errors: response.validationErrors ?? { non_field_errors: response.errors },
  };
}
