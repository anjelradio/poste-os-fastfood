import { z } from "zod";

const MeasureUnitResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});

const CategoryResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
});

export const RawMaterialResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock: z.string(),
  min_stock: z.string(),
  measure_unit: MeasureUnitResponseDtoSchema,
  category: CategoryResponseDtoSchema,
});

export const RawMaterialsListResponseSchema = z.array(RawMaterialResponseDtoSchema);

export type RawMaterialResponseDto = z.infer<typeof RawMaterialResponseDtoSchema>;
