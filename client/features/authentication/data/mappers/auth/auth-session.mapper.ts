import type { LoginResponseDto } from "../../schemas/auth.schema";
import type { AuthSession } from "../../types/auth.types";
import { toAuthUserEntity } from "./auth-user.mapper";

export function toAuthSessionEntity(data: LoginResponseDto): AuthSession {
  return {
    tokens: {
      accessToken: data.tokens.access,
      refreshToken: data.tokens.refresh,
    },
    user: toAuthUserEntity(data.user),
  };
}
