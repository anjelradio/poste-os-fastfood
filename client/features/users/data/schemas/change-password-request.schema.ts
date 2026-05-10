import { z } from "zod";

export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "La contraseña actual es requerida" }),
    newPassword: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .refine((value) => (value.match(/[A-Z]/g) ?? []).length >= 2, {
        message: "La contraseña debe tener al menos 2 letras mayúsculas",
      })
      .refine((value) => (value.match(/[0-9]/g) ?? []).length >= 2, {
        message: "La contraseña debe tener al menos 2 números",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "La confirmación de contraseña es requerida" }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser distinta a la actual",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "La nueva contraseña y su confirmación no coinciden",
    path: ["confirmPassword"],
  });
