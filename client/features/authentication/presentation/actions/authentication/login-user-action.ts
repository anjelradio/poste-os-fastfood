"use server";

import { authRepository } from "@/features/authentication/data/repositories/auth.repository";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import type { User } from "@/features/authentication/domain/entities/user";
import { cookies } from "next/headers";

type LoginUserData = {
  user: User;
};

export async function loginUser(data: unknown): Promise<ApiResult<LoginUserData>> {
  const response = await authRepository.login(data);
  if (!response.ok) {
    return response;
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", response.data.tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });
  cookieStore.set("refresh_token", response.data.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("user_role", response.data.user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return {
    ok: true,
    data: {
      user: response.data.user,
    },
  };
}
