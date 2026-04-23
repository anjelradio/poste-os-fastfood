import { z } from "zod";

export const ChangePasswordRequestSchema = z
  .object({
    current_password: z.string().min(1, { message: "La contraseña actual es requerida" }),
    new_password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .refine((value) => (value.match(/[A-Z]/g) ?? []).length >= 2, {
        message: "La contraseña debe tener al menos 2 letras mayúsculas",
      })
      .refine((value) => (value.match(/[0-9]/g) ?? []).length >= 2, {
        message: "La contraseña debe tener al menos 2 números",
      }),
    confirm_password: z
      .string()
      .min(1, { message: "La confirmación de contraseña es requerida" }),
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "La nueva contraseña debe ser distinta a la actual",
    path: ["new_password"],
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "La nueva contraseña y su confirmación no coinciden",
    path: ["confirm_password"],
  });
