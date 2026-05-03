import { z } from "zod";

export const UserResponseDtoSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  last_name: z.string(),
  role: z.enum(["ADMIN", "CAJA", "COCINA"]),
});

export const UsersListResponseSchema = z.array(UserResponseDtoSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;
