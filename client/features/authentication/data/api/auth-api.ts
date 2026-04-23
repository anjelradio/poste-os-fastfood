import { env } from "@/lib/config/env";
import {
  errorResult,
  serverErrorResult,
  zodValidationErrorResult,
} from "@/features/shared/data/infrastructure/api-error-result";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import {
  ForgotPasswordRequestSchema,
  ForgotPasswordVerifyOtpSchema,
  LoginFormSchema,
  LoginResponseSchema,
  MessageResponseSchema,
  type LoginResponseData,
} from "../schemas/auth.schema";

export const authApi = {
  async login(data: unknown): Promise<ApiResult<LoginResponseData>> {
    const parsedData = LoginFormSchema.safeParse(data);
    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    try {
      const res = await fetch(`${env.API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al iniciar sesión.");
      }

      const responseData = await res.json();
      const parsedResult = LoginResponseSchema.safeParse(responseData);
      if (!parsedResult.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedResult.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async requestForgotPasswordOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string }>> {
    const parsedData = ForgotPasswordRequestSchema.safeParse(data);
    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    try {
      const res = await fetch(`${env.API_URL}/auth/forgot-password/request-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "No se pudo enviar el código OTP.");
      }

      const responseData = await res.json();
      const parsedResult = MessageResponseSchema.safeParse(responseData);
      if (!parsedResult.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedResult.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async verifyForgotPasswordOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string }>> {
    const parsedData = ForgotPasswordVerifyOtpSchema.safeParse(data);
    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    try {
      const res = await fetch(`${env.API_URL}/auth/forgot-password/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(
          res,
          "No se pudo verificar el código OTP para restablecer la contraseña.",
        );
      }

      const responseData = await res.json();
      const parsedResult = MessageResponseSchema.safeParse(responseData);
      if (!parsedResult.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedResult.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },
};
