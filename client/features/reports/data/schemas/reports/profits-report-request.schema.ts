import { z } from "zod";

export const ProfitsReportRequestSchema = z
  .object({
    fromDate: z.string().trim().min(1, { message: "La fecha desde es obligatoria" }),
    toDate: z.string().trim().min(1, { message: "La fecha hasta es obligatoria" }),
    reportFormat: z.enum(["pdf", "excel"]),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "La fecha desde no puede ser mayor a la fecha hasta",
    path: ["toDate"],
  });

export type ProfitsReportRequest = z.infer<typeof ProfitsReportRequestSchema>;
