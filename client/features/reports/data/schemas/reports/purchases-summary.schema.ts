import { z } from "zod";

export const PurchasesSummaryRequestSchema = z
  .object({
    fromDate: z.string().trim().min(1, { message: "La fecha desde es obligatoria" }),
    toDate: z.string().trim().min(1, { message: "La fecha hasta es obligatoria" }),
    source: z.enum(["voice", "static", "text"]).default("text"),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "La fecha desde no puede ser mayor a la fecha hasta",
    path: ["toDate"],
  });

export const PurchasesSummaryResponseSchema = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  purchasesCount: z.number(),
  totalAmount: z.number(),
  averagePurchase: z.number(),
  topSupplier: z
    .object({
      name: z.string(),
      total: z.number(),
      purchasesCount: z.number(),
    })
    .nullable(),
  recentPurchases: z.array(
    z.object({
      id: z.number(),
      date: z.string(),
      supplier: z.string(),
      description: z.string(),
      total: z.number(),
    }),
  ),
});

export type PurchasesSummaryRequest = z.infer<typeof PurchasesSummaryRequestSchema>;
export type PurchasesSummary = z.infer<typeof PurchasesSummaryResponseSchema>;
