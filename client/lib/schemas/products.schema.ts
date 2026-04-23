import { z } from "zod";

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    image: z.string(),
    slug: z.string(),
    categoryId: z.number(),
});

export const ProductListSchema = z.array(ProductSchema);

export const CategorySimpleSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const ProductSimpleSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    slug: z.string(),
    category: CategorySimpleSchema,
});

export const ProductSimpleListSchema = z.array(ProductSimpleSchema);

export const ProductsResponseSchema = z.object({
    data: z.array(ProductSimpleSchema),
    totalProducts: z.number(),
});

export const ProductFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "El Nombre del Producto no puede ir vacio" }),
    price: z
        .string()
        .trim()
        .transform((value) => parseFloat(value))
        .refine((value) => value > 0, { message: "Precio no válido" })
        .or(z.number().min(1, { message: "La Categoría es Obligatoria" })),
    categoryId: z
        .string()
        .trim()
        .transform((value) => parseInt(value))
        .refine((value) => value > 0, {
            message: "La Categoría es Obligatoria",
        })
        .or(z.number().min(1, { message: "La Categoría es Obligatoria" })),
    image: z.string().min(1, { message: "La Imagen es Obligatoria" }),
});

// Types
export type Product = z.infer<typeof ProductSchema>;
export type ProductSimple = z.infer<typeof ProductSimpleSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
