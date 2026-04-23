import { z } from "zod";
import { UserSchema } from "../../domain/entities/user";

export const UsersListResponseSchema = z.array(UserSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
