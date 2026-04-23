import { z } from "zod";

export const ChangeEmailVerifyOtpRequestSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "El código OTP debe tener exactamente 6 dígitos"),
});

export const ChangeEmailConfirmRequestSchema = z.object({
  verification_token: z.string().min(1, "El token de verificación es requerido"),
  new_email: z.string().email("El correo electrónico no es válido"),
});

export const ChangeEmailVerifyOtpResponseSchema = z.object({
  message: z.string(),
  verification_token: z.string(),
});
