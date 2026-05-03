import { z } from "zod";

export const RawMaterialResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const RawMaterialsListResponseSchema = z.array(RawMaterialResponseDtoSchema);

export type RawMaterialResponseDto = z.infer<typeof RawMaterialResponseDtoSchema>;
