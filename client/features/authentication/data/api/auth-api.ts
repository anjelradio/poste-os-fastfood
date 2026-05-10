import { env } from "@/lib/config/env";
import {
  apiRequestJson,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import type { AuthResult } from "../types/auth.types";
import {
  ForgotPasswordRequestSchema,
  ForgotPasswordVerifyOtpSchema,
  LoginFormSchema,
  LoginResponseSchema,
  MessageResponseSchema,
} from "../schemas/auth.schema";
import { toAuthSessionEntity } from "../mappers/auth/auth-session.mapper";
import { toMessageEntity } from "../mappers/auth/message.mapper";

const BASE_URL = `${env.API_URL}/auth`

export const authApi = {
  async login(data: unknown): Promise<AuthResult> {
    const input = parseWithSchema(LoginFormSchema, data);
    if (!input.ok) {
      return input;
    }
    return apiRequestJson({
      url: `${BASE_URL}/login/`,
      method: "POST",
      body: input.data,
      fallbackMessage: "Error al iniciar sesión.",
      responseSchema: LoginResponseSchema,
      mapData: toAuthSessionEntity,
    });
  },

  async requestForgotPasswordOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string }>> {
    const input = parseWithSchema(ForgotPasswordRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    return apiRequestJson({
      url: `${BASE_URL}/forgot-password/request-otp/`,
      method: "POST",
      body: input.data,
      fallbackMessage: "No se pudo enviar el código OTP.",
      responseSchema: MessageResponseSchema,
      mapData: toMessageEntity,
    });
  },

  async verifyForgotPasswordOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string }>> {
    const input = parseWithSchema(ForgotPasswordVerifyOtpSchema, data);
    if (!input.ok) {
      return input;
    }

    return apiRequestJson({
      url: `${BASE_URL}/forgot-password/verify-otp/`,
      method: "POST",
      body: input.data,
      fallbackMessage:
        "No se pudo verificar el código OTP para restablecer la contraseña.",
      responseSchema: MessageResponseSchema,
      mapData: toMessageEntity,
    });
  },
};
