import { z } from "zod";

export const MeasureUnitResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});

export const MeasureUnitsListResponseSchema = z.array(MeasureUnitResponseDtoSchema);

export type MeasureUnitResponseDto = z.infer<typeof MeasureUnitResponseDtoSchema>;
