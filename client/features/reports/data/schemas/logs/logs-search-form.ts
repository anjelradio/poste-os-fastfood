import { z } from "zod";

export const SearchLogsSchema = z.object({
  area: z.string(),
  date: z.string().min(1, { message: "Debe seleccionar una fecha" }),
});
