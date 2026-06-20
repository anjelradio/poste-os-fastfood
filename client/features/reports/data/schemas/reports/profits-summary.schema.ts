import { z } from "zod";

export const ProfitsSummaryRequestSchema = z
  .object({
    fromDate: z.string().trim().min(1, { message: "La fecha desde es obligatoria" }),
    toDate: z.string().trim().min(1, { message: "La fecha hasta es obligatoria" }),
    source: z.enum(["voice", "static", "text"]).default("text"),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "La fecha desde no puede ser mayor a la fecha hasta",
    path: ["toDate"],
  });

export const ProfitsSummaryResponseSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  ordersCount: z.number(),
  totalAmount: z.number(),
  averageTicket: z.number(),
  bestDay: z
    .object({
      date: z.string(),
      total: z.number(),
      ordersCount: z.number(),
    })
    .nullable(),
  recentOrders: z.array(
    z.object({
      orderNumber: z.number(),
      date: z.string(),
      client: z.string(),
      type: z.string(),
      status: z.string(),
      total: z.number(),
    }),
  ),
});

export type ProfitsSummaryRequest = z.infer<typeof ProfitsSummaryRequestSchema>;
export type ProfitsSummary = z.infer<typeof ProfitsSummaryResponseSchema>;
