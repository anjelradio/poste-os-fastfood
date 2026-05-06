import { z } from "zod";

export const SupplierRequestSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(1, { message: "La razon social es obligatoria" }),
  contactName: z
    .string()
    .trim()
    .min(1, { message: "El nombre de contacto es obligatorio" }),
  phone: z.string().trim().min(1, { message: "El telefono es obligatorio" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "El correo es obligatorio" })
    .email({ message: "El correo no es valido" }),
});

export type SupplierRequest = z.infer<typeof SupplierRequestSchema>;
