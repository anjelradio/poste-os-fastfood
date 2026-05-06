import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.number(),
  businessName: z.string(),
  contactName: z.string(),
  phone: z.string(),
  email: z.string(),
});

export type Supplier = z.infer<typeof SupplierSchema>;
