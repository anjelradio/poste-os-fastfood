"use server";

import { revalidatePath } from "next/cache";
import { usersRepository } from "../../data/repositories/users.repository";

export async function updateProfileInfoAction(data: unknown) {
  const response = await usersRepository.updateProfileInfo(data);

  if (response.ok) {
    revalidatePath("/perfil");
  }

  return response;
}

export async function changePasswordAction(data: unknown) {
  const response = await usersRepository.changePassword(data);

  if (response.ok) {
    revalidatePath("/perfil");
  }

  return response;
}

export async function requestChangeEmailOtpAction() {
  return usersRepository.requestChangeEmailOtp();
}

export async function verifyChangeEmailOtpAction(data: unknown) {
  return usersRepository.verifyChangeEmailOtp(data);
}

export async function confirmChangeEmailAction(data: unknown) {
  const response = await usersRepository.confirmChangeEmail(data);

  if (response.ok) {
    revalidatePath("/perfil");
  }

  return response;
}
