import { z } from "zod";

export const LogSchema = z.object({
  id: z.number(),
  created_date: z.string(),
  time: z.string(),
  area: z.string(),
  user: z.string(),
  action: z.string(),
  description: z.string(),
  ip_address: z.string().nullable(),
});

export type Log = z.infer<typeof LogSchema>;
