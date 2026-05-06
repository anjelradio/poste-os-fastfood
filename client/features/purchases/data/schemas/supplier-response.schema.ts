import { z } from "zod";

export const SupplierResponseDtoSchema = z.object({
  id: z.number(),
  bussines_name: z.string(),
  contact_name: z.string(),
  phone: z.string(),
  email: z.string(),
});

export const SuppliersListResponseSchema = z.array(SupplierResponseDtoSchema);

export type SupplierResponseDto = z.infer<typeof SupplierResponseDtoSchema>;
export type SuppliersListResponseDto = z.infer<typeof SuppliersListResponseSchema>;
