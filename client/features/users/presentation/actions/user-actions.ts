"use server";

import { revalidatePath } from "next/cache";
import { usersRepository } from "../../data/repositories/users.repository";

export async function getUserByIdAction(id: number) {
  return usersRepository.getUserById(id);
}

export async function createUserAction(data: unknown) {
  const response = await usersRepository.createUser(data);

  if (response.ok) {
    revalidatePath("/administracion/usuarios");
  }

  return response;
}

export async function updateUserAction(id: number, data: unknown) {
  const response = await usersRepository.updateUser(id, data);

  if (response.ok) {
    revalidatePath("/administracion/usuarios");
    revalidatePath("/administracion/usuarios/search");
  }

  return response;
}

export async function deleteUserAction(id: number) {
  const response = await usersRepository.deleteUser(id);

  if (response.ok) {
    revalidatePath("/administracion/usuarios");
    revalidatePath("/administracion/usuarios/search");
  }

  return response;
}
