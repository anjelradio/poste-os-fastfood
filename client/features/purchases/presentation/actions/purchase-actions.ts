"use server";

import { revalidatePath } from "next/cache";
import { purchasesRepository } from "../../data/repositories/purchases.repository";

const purchasesPath = "/administracion/compras-y-proveedores/compras";

export async function getPurchaseByIdAction(id: number) {
  return purchasesRepository.getPurchaseById(id);
}

export async function createPurchaseAction(data: unknown) {
  const response = await purchasesRepository.createPurchase(data);
  if (response.ok) {
    revalidatePath(purchasesPath);
  }
  return response;
}

export async function updatePurchaseAction(id: number, data: unknown) {
  const response = await purchasesRepository.updatePurchase(id, data);
  if (response.ok) {
    revalidatePath(purchasesPath);
    revalidatePath(`${purchasesPath}/${id}/editar`);
  }
  return response;
}

export async function deletePurchaseAction(id: number) {
  const response = await purchasesRepository.deletePurchase(id);
  if (response.ok) {
    revalidatePath(purchasesPath);
    revalidatePath(`${purchasesPath}/${id}/editar`);
  }
  return response;
}
