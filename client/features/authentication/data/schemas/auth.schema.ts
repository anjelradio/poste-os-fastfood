import { z } from "zod";

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

export const AuthUserResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  last_name: z.string(),
  role: z.enum(["CAJA", "COCINA", "ADMIN"]),
});

export const LoginResponseSchema = z.object({
  tokens: TokensSchema,
  user: AuthUserResponseSchema,
});

export type AuthUserResponseDto = z.infer<typeof AuthUserResponseSchema>;
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>;
