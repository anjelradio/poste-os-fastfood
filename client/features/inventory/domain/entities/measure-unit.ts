import { z } from "zod";

export const MeasureUnitSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});

export type MeasureUnit = z.infer<typeof MeasureUnitSchema>;
