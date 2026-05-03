import { z } from "zod";

export const LogSchema = z.object({
  id: z.number(),
  createdDate: z.string(),
  time: z.string(),
  area: z.string(),
  user: z.string(),
  action: z.string(),
  description: z.string(),
  ipAddress: z.string().nullable(),
});

export type Log = z.infer<typeof LogSchema>;
