import { optional, z } from "zod";

export const LogBookSchema = z.object({
  id: z.number(),
  created_date: z.string(),
  time: z.string(),
  area: z.string(),
  user: z.string(),
  action: z.string(),
  description: z.string(),
});

export const LogBookResponseSchema = z.object({
  data: z.array(LogBookSchema),
  totalLogs: z.number(),
});

export const SearchLogsSchema = z.object({
  area: z.string(),
  date: z.string().min(1, { message: "Debe seleccionar una fecha" }),
});
