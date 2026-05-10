import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  subtotal: z.string().or(z.number()),
});

export const OrderListItemSchema = z.object({
  id: z.number(),
  orderNumber: z.number(),
  clientName: z.string(),
  total: z.string().or(z.number()),
  type: z.string(),
  status: z.string(),
  readyAt: z.string().nullable(),
  items: z.array(OrderItemSchema),
});

export const OrderListSchema = z.array(OrderListItemSchema);

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderListItem = z.infer<typeof OrderListItemSchema>;
export type OrderList = z.infer<typeof OrderListSchema>;
