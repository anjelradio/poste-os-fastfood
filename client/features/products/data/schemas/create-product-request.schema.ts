import { z } from "zod";

export const CreateProductRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "El Nombre del Producto no puede ir vacio" }),
  price: z.coerce.number().gt(0, { message: "Precio no valido" }),
  category: z.coerce
    .number()
    .int()
    .gt(0, { message: "La Categoria es Obligatoria" }),
  hasRecipe: z.coerce.boolean(),
  image: z
    .union([z.string().trim(), z.null(), z.undefined()])
    .transform((value) => {
      if (!value) {
        return null;
      }

      return value;
    }),
});

export const UpdateProductRequestSchema = CreateProductRequestSchema;

export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
