import { z } from "zod";

export const CreateRawMaterialRequestSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
  minStock: z.coerce.number().min(0, "El stock minimo no puede ser negativo"),
  measureUnit: z.coerce.number().int().positive("La unidad de medida es obligatoria"),
  category: z.coerce.number().int().positive("La categoria es obligatoria"),
});

export const UpdateRawMaterialRequestSchema = CreateRawMaterialRequestSchema;

export type CreateRawMaterialRequest = z.infer<typeof CreateRawMaterialRequestSchema>;
