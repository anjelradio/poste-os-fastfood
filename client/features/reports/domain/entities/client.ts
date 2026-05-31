import { z } from "zod";

export const ClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  nit: z.string().nullable(),
  createdDate: z.string(),
});

export type Client = z.infer<typeof ClientSchema>;
