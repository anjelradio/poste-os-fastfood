import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  last_name: z.string(),
  role: z.enum(["ADMIN", "CAJA", "COCINA"]),
});

export type User = z.infer<typeof UserSchema>;
