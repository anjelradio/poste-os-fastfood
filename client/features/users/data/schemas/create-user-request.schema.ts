import { z } from "zod";

export const CreateUserRequestSchema = z.object({
  username: z.string().trim().min(1, { message: "El usuario es requerido" }),
  name: z.string().trim().min(1, { message: "El nombre es requerido" }),
  last_name: z.string().trim().min(1, { message: "El apellido es requerido" }),
  email: z.string().trim().email({ message: "Correo electrónico no válido" }),
  role: z.enum(["ADMIN", "CAJA", "COCINA"], {
    message: "El rol es requerido",
  }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .refine((value) => (value.match(/[A-Z]/g) ?? []).length >= 2, {
      message: "La contraseña debe tener al menos 2 letras mayúsculas",
    })
    .refine((value) => (value.match(/[0-9]/g) ?? []).length >= 2, {
      message: "La contraseña debe tener al menos 2 números",
    }),
});

export const UpdateUserRequestSchema = CreateUserRequestSchema.extend({
  password: z
    .string()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || value.length >= 6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .refine((value) => value === "" || (value.match(/[A-Z]/g) ?? []).length >= 2, {
      message: "La contraseña debe tener al menos 2 letras mayúsculas",
    })
    .refine((value) => value === "" || (value.match(/[0-9]/g) ?? []).length >= 2, {
      message: "La contraseña debe tener al menos 2 números",
    }),
});
