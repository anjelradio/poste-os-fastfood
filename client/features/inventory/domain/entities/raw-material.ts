import { z } from "zod";

export const RawMaterialSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type RawMaterial = z.infer<typeof RawMaterialSchema>;
