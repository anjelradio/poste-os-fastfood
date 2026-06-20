import { z } from "zod";

export const ProductSalesReportRequestSchema = z
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
    includeOrders: z.boolean().optional().default(false),
    reportFormat: z.enum(["pdf", "excel"]),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "La fecha desde no puede ser mayor a la fecha hasta",
    path: ["toDate"],
  });

export type ProductSalesReportRequest = z.infer<typeof ProductSalesReportRequestSchema>;
