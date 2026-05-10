import { z } from "zod";

export const OrderDetailItemResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  subtotal: z.string().or(z.number()),
});

export const OrderDetailResponseSchema = z.object({
  id: z.number(),
  order_number: z.number(),
  client_name: z.string(),
  type: z.string(),
  reserved_at: z.string().nullable(),
  status: z.string(),
  items: z.array(OrderDetailItemResponseDtoSchema),
  client_phone: z.string().nullable(),
  address: z.string().nullable(),
  reference_note: z.string().nullable(),
});

export type OrderDetailResponseDto = z.infer<typeof OrderDetailResponseSchema>;
