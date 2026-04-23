import { z } from "zod";

export const UpdateProfileInfoRequestSchema = z.object({
  username: z.string().trim().min(1, { message: "El usuario es requerido" }),
  name: z.string().trim().min(1, { message: "El nombre es requerido" }),
  last_name: z.string().trim().min(1, { message: "El apellido es requerido" }),
});
