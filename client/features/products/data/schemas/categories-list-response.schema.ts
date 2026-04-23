import { z } from "zod";
import { CategorySchema } from "../../domain/entities/category";

export const CategoriesListResponseSchema = z.array(CategorySchema);

export type CategoriesListResponse = z.infer<
  typeof CategoriesListResponseSchema
>;
