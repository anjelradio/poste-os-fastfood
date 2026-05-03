import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  lastName: z.string(),
  role: z.enum(["CAJA", "COCINA", "ADMIN"]),
});

export type User = z.infer<typeof UserSchema>;
