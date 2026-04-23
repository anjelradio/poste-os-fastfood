import { z } from "zod";

export const OrderSchema = z.object({
  client: z.string().min(1, "El nombre del Cliente es Obligatorio"),
  total: z.number().min(1, "Hay errores en la Orden"),
  type: z.string().min(1, "El tipo de orden es Obligatorio"),
  order: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.string(),
      quantity: z.number(),
      subtotal: z.number(),
    }),
  ),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  subtotal: z.string().or(z.number()),
});

export const OrderListItemSchema = z.object({
  id: z.number(),
  nro: z.number(),
  client: z.string(),
  total: z.string().or(z.number()),
  type: z.string(),
  status: z.string(),
  orderReadyAt: z.string().nullable(),
  items: z.array(OrderItemSchema),
});

export const OrderListSchema = z.array(OrderListItemSchema);

// Filtros para la busqueda de ordenes
export const OrdersSearchSchema = z.object({
  date: z.string().min(1, { message: "Debe seleccionar una Fecha." }),
  status: z.string(),
  type: z.string(),
});

export type OrderListItem = z.infer<typeof OrderListItemSchema>;
export type OrderList = z.infer<typeof OrderListSchema>;
