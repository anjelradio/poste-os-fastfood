import { z } from "zod";

export const OrderItemResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  subtotal: z.string().or(z.number()),
});

export const OrderListItemResponseDtoSchema = z.object({
  id: z.number(),
  order_number: z.number(),
  client_name: z.string(),
  total: z.string().or(z.number()),
  type: z.string(),
  status: z.string(),
  ready_at: z.string().nullable(),
  items: z.array(OrderItemResponseDtoSchema),
});

export const OrdersListResponseSchema = z.array(OrderListItemResponseDtoSchema);

export type OrderListItemResponseDto = z.infer<typeof OrderListItemResponseDtoSchema>;
