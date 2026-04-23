import { z } from "zod";

import {
  ProductSchema,
  ProductSimpleSchema,
  ProductsResponseSchema,
} from "../schemas/products.schema";
import {
  LogBookResponseSchema,
  LogBookSchema,
} from "../schemas/logbook.schema";
import { CredentialsSchema, UserSchema } from "../schemas/auth.schema";

export type User = z.infer<typeof UserSchema>;

// Types Productos
export type Product = z.infer<typeof ProductSchema>;
export type ProductSimple = z.infer<typeof ProductSimpleSchema>;
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;

// Others
export type OrderItem = Pick<Product, "id" | "name" | "price" | "image"> & {
  quantity: number;
  subtotal: number;
};

// Bitacora
export type LoogBook = z.infer<typeof LogBookSchema>;
export type LoogBookResponse = z.infer<typeof LogBookResponseSchema>;

// Credencaile spara login
export type Credentials = z.infer<typeof CredentialsSchema>;
