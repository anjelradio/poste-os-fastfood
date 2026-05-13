import { z } from "zod";

export const SupplierResponseDtoSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  contact_name: z.string(),
  phone: z.string(),
  email: z.string(),
});

export type SupplierResponseDto = z.infer<typeof SupplierResponseDtoSchema>;