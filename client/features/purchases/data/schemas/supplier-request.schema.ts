import { z } from "zod";

export const CreateSupplierRequestSchema = z.object({
  businessName: z.string().min(1, "La razon social es obligatoria"),
  contactName: z.string().min(1, "El nombre de contacto es obligatorio"),
  phone: z.string().min(1, "El telefono es obligatorio"),
  email: z.string().min(1, "El correo es obligatorio").email("El correo no es valido"),
});

export const UpdateSupplierRequestSchema = CreateSupplierRequestSchema;

export type CreateSupplierRequest = z.infer<typeof CreateSupplierRequestSchema>;
