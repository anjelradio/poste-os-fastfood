import { z } from "zod";

export const ProductSalesSummaryRequestSchema = z
  .object({
    fromDate: z.string().trim().min(1, { message: "La fecha desde es obligatoria" }),
    toDate: z.string().trim().min(1, { message: "La fecha hasta es obligatoria" }),
    productId: z.preprocess(
      (value) => {
        if (value == null || value === "") return undefined;
        const numberValue = Number(value);
        return Number.isNaN(numberValue) ? value : numberValue;
      },
      z.number().int().positive({ message: "El producto es obligatorio" }),
    ),
    source: z.enum(["voice", "static", "text"]).default("text"),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "La fecha desde no puede ser mayor a la fecha hasta",
    path: ["toDate"],
  });

export const ProductSalesSummaryResponseSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  product: z.object({
    id: z.number(),
    name: z.string(),
  }),
  ordersCount: z.number(),
  quantitySold: z.number(),
  totalRevenue: z.number(),
  averageOrderRevenue: z.number(),
  bestDay: z
    .object({
      date: z.string(),
      total: z.number(),
      ordersCount: z.number(),
    })
    .nullable(),
  recentSales: z.array(
    z.object({
      orderNumber: z.number(),
      date: z.string(),
      client: z.string(),
      quantity: z.number(),
      subtotal: z.number(),
    }),
  ),
});

export type ProductSalesSummaryRequest = z.infer<typeof ProductSalesSummaryRequestSchema>;
export type ProductSalesSummary = z.infer<typeof ProductSalesSummaryResponseSchema>;
