import { z } from "zod";

export const ClientResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  nit: z.string().nullable(),
  created_date: z.string(),
});

export const ClientsListResponseSchema = z.array(ClientResponseDtoSchema);

export type ClientResponseDto = z.infer<typeof ClientResponseDtoSchema>;
