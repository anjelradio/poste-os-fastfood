"use server";

import { revalidatePath } from "next/cache";
import { suppliersRepository } from "../../data/repositories/supplier.repository";

const suppliersPath = "/administracion/compras-y-proveedores/proveedores";

export async function getSupplierByIdAction(id: number) {
  return suppliersRepository.getSupplierById(id);
}

export async function createSupplierAction(data: unknown) {
  const response = await suppliersRepository.createSupplier(data);

  if (response.ok) {
    revalidatePath(suppliersPath);
  }

  return response;
}

export async function updateSupplierAction(id: number, data: unknown) {
  const response = await suppliersRepository.updateSupplier(id, data);

  if (response.ok) {
    revalidatePath(suppliersPath);
  }

  return response;
}

export async function deleteSupplierAction(id: number) {
  const response = await suppliersRepository.deleteSupplier(id);

  if (response.ok) {
    revalidatePath(suppliersPath);
  }

  return response;
}