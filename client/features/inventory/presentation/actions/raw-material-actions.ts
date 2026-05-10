"use server";

import { revalidatePath } from "next/cache";
import { inventoryRepository } from "../../data/repositories/inventory.repository";

const rawMaterialsPath = "/administracion/inventario/materias-primas";

export async function getRawMaterialByIdAction(id: number) {
  return inventoryRepository.getRawMaterialById(id);
}

export async function createRawMaterialAction(data: unknown) {
  const response = await inventoryRepository.createRawMaterial(data);

  if (response.ok) {
    revalidatePath(rawMaterialsPath);
  }

  return response;
}

export async function updateRawMaterialAction(id: number, data: unknown) {
  const response = await inventoryRepository.updateRawMaterial(id, data);

  if (response.ok) {
    revalidatePath(rawMaterialsPath);
  }

  return response;
}

export async function deleteRawMaterialAction(id: number) {
  const response = await inventoryRepository.deleteRawMaterial(id);

  if (response.ok) {
    revalidatePath(rawMaterialsPath);
  }

  return response;
}
