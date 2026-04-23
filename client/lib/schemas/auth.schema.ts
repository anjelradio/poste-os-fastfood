import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  last_name: z.string(),
  role: z.enum(["CAJA", "COCINA", "ADMIN"]),
});

export const TokensSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export const LoginResponseSchema = z.object({
  tokens: TokensSchema,
  user: UserSchema,
});

export const CredentialsSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const ProfileInfoFormSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es Obligatorio"),
  name: z.string().min(1, "El nombre es Obligatorio"),
  last_name: z.string().min(1, "El apellido es Obligatorio"),
});

export type User = z.infer<typeof UserSchema>;
export type Tokens = z.infer<typeof TokensSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type Credentials = z.infer<typeof CredentialsSchema>;
