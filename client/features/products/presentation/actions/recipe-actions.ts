"use server";

import { revalidatePath } from "next/cache";
import { recipesRepository } from "../../data/repositories/recipes.repository";

export async function getRecipeByProductIdAction(productId: number) {
  return recipesRepository.getRecipeByProductId(productId);
}

export async function saveRecipeByProductIdAction(productId: number, data: unknown) {
  const response = await recipesRepository.saveRecipeByProductId(productId, data);

  if (response.ok) {
    revalidatePath("/cocina/recetas");
    revalidatePath(`/cocina/recetas/${productId}/editar`);
  }

  return response;
}

export async function deleteRecipeByProductIdAction(productId: number) {
  const response = await recipesRepository.deleteRecipeByProductId(productId);

  if (response.ok) {
    revalidatePath("/cocina/recetas");
    revalidatePath(`/cocina/recetas/${productId}/editar`);
  }

  return response;
}
