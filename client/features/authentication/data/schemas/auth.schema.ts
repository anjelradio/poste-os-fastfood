import { z } from "zod";
import { UserSchema } from "../../domain/entities/user";

export const TokensSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export const LoginFormSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
});

export const ForgotPasswordVerifyOtpSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "El código OTP debe tener exactamente 6 dígitos"),
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export const LoginResponseSchema = z.object({
  tokens: TokensSchema,
  user: UserSchema,
});

export type LoginResponseData = z.infer<typeof LoginResponseSchema>;
