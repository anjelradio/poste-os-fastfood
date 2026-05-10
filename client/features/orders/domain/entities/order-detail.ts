import { z } from "zod";
import { OrderType } from "./order";

export const OrderDetailItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  subtotal: z.string().or(z.number()),
});

export const OrderDetailSchema = z.object({
  id: z.number(),
  orderNumber: z.number(),
  clientName: z.string(),
  orderType: z.nativeEnum(OrderType),
  reservedAt: z.string().nullable(),
  status: z.string(),
  items: z.array(OrderDetailItemSchema),
  clientPhone: z.string().nullable(),
  address: z.string().nullable(),
  referenceNote: z.string().nullable(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;
