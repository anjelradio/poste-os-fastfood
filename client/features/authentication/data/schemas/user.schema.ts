import { z } from "zod";

export const ProfileInfoFormSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es Obligatorio"),
  name: z.string().min(1, "El nombre es Obligatorio"),
  lastName: z.string().min(1, "El apellido es Obligatorio"),
});
