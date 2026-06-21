import { z } from "zod";
import { OrderType, PaymentType } from "../../domain/entities/order";

export const RegisterOrderRequestSchema = z.object({
  clientName: z.string().min(1, "El nombre del Cliente es Obligatorio"),
  reservedAt: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.string().optional(),
  ),
  orderType: z.preprocess(
    (value) => (value == null ? "" : value),
    z
      .string()
      .min(1, "El tipo de orden es Obligatorio")
      .refine(
        (value) => Object.values(OrderType).includes(value as OrderType),
        "Tipo de orden inválido",
      ),
  ),
  order: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    }),
  ).min(1, "La orden no puede estar vacia"),
  clientPhone: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().optional(),
  ),
  address: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().optional(),
  ),
  referenceNote: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().optional(),
  ),
  nit: z.string().min(1, "El NIT es obligatorio"),
  paymentType: z.preprocess(
    (value) => (value == null ? "" : value),
    z.string().min(1, "El tipo de pago es obligatorio").refine(
      (value) => Object.values(PaymentType).includes(value as PaymentType),
      "Tipo de pago inválido",
    ),
  ),
  email: z.preprocess(
    (value) => (value == null || value === "" ? undefined : value),
    z.string().email("Correo electrónico inválido").optional(),
  ),
}).superRefine((data, ctx) => {
  if (data.orderType === OrderType.DELIVERY) {
    if (!data.clientPhone || !data.clientPhone.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["clientPhone"],
        message: "El número del cliente es obligatorio para envío",
      });
    }

    if (!data.address || !data.address.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "La dirección es obligatoria para envío",
      });
    }
  }
});

export type RegisterOrderRequest = z.infer<typeof RegisterOrderRequestSchema>;
