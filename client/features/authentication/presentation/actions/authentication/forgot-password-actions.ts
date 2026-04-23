"use server";

import { authRepository } from "@/features/authentication/data/repositories/auth.repository";

export async function requestForgotPasswordOtpAction(data: unknown) {
  return authRepository.requestForgotPasswordOtp(data);
}

export async function verifyForgotPasswordOtpAction(data: unknown) {
  return authRepository.verifyForgotPasswordOtp(data);
}
