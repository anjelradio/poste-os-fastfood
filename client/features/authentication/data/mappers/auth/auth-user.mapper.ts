import type { User } from "@/features/authentication/domain/entities/user";
import type { AuthUserResponseDto } from "../../schemas/auth.schema";

export function toAuthUserEntity(dto: AuthUserResponseDto): User {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    name: dto.name,
    lastName: dto.last_name,
    role: dto.role,
  };
}
