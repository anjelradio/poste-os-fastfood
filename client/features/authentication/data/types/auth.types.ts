import type { ApiResult } from "@/features/shared/data/types/api-result";
import type { User } from "../../domain/entities/user";

export type AuthSession = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
};

export type AuthResult = ApiResult<AuthSession>;
