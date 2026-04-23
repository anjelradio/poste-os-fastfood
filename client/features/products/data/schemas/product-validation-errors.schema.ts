import { z } from "zod";

export const ProductValidationErrorsSchema = z.record(
  z.string(),
  z.array(z.string()),
);

export type ProductValidationErrors = z.infer<typeof ProductValidationErrorsSchema>;
