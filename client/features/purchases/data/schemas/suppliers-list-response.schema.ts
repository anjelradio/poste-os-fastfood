import { z } from "zod";

import { SupplierResponseDtoSchema } from "./supplier-response.schema";

export const SuppliersListResponseSchema = z.array(SupplierResponseDtoSchema);
