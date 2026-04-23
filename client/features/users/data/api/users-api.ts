import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  errorResult,
  serverErrorResult,
  zodValidationErrorResult,
} from "@/features/shared/data/infrastructure/api-error-result";
import type {
  ApiMaybeResult,
  ApiResult,
  ApiStatusResult,
} from "@/features/shared/data/types/api-result";
import { UserSchema, type User } from "../../domain/entities/user";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
} from "../schemas/create-user-request.schema";
import { UpdateProfileInfoRequestSchema } from "../schemas/update-profile-info-request.schema";
import { ChangePasswordRequestSchema } from "../schemas/change-password-request.schema";
import {
  ChangeEmailConfirmRequestSchema,
  ChangeEmailVerifyOtpRequestSchema,
  ChangeEmailVerifyOtpResponseSchema,
} from "../schemas/change-email-request.schema";
import {
  UsersListResponseSchema,
  type UsersListResponse,
} from "../schemas/users-list-response.schema";

const baseUrl = `${env.API_URL}/users`;

export const usersApi = {
  async getUsers(filters?: { username: string; role: string }): Promise<ApiResult<UsersListResponse>> {
    const params = new URLSearchParams();

    if (filters?.username) {
      params.set("username", filters.username);
    }

    if (filters?.role) {
      params.set("role", filters.role);
    }

    const token = await getAccessToken();

    try {
      const query = params.toString();
      const res = await fetch(query ? `${baseUrl}/?${query}` : `${baseUrl}/`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al obtener los usuarios.");
      }

      const responseData = await res.json();
      const parsedData = UsersListResponseSchema.safeParse(responseData);

      if (!parsedData.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedData.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async getUserById(id: number): Promise<ApiMaybeResult<User>> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 404) {
        return {
          ok: true,
          data: null,
        };
      }

      if (!res.ok) {
        return errorResult("Error al obtener el usuario.");
      }

      const responseData = await res.json();
      const parsedData = UserSchema.safeParse(responseData);

      if (!parsedData.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedData.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async createUser(data: unknown): Promise<ApiStatusResult> {
    const parsedData = CreateUserRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al crear el usuario.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async updateProfileInfo(data: unknown): Promise<ApiResult<User>> {
    const parsedData = UpdateProfileInfoRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${env.API_URL}/auth/update-info/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al actualizar la información.");
      }

      const responseData = await res.json();
      const parsedResult = UserSchema.safeParse(responseData);

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

  async updateUser(id: number, data: unknown): Promise<ApiStatusResult> {
    const parsedData = UpdateUserRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();
    const payload =
      parsedData.data.password === ""
        ? { ...parsedData.data, password: undefined }
        : parsedData.data;

    if (payload.password === undefined) {
      delete payload.password;
    }

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al actualizar el usuario.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async deleteUser(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al eliminar el usuario.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async changePassword(data: unknown): Promise<ApiStatusResult> {
    const parsedData = ChangePasswordRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${env.API_URL}/auth/change-password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al actualizar la contraseña.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async requestChangeEmailOtp(): Promise<ApiResult<{ message: string }>> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${env.API_URL}/auth/change-email/request-otp/`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al solicitar el código OTP.");
      }

      const responseData = await res.json();
      if (
        !responseData ||
        typeof responseData !== "object" ||
        !("message" in responseData) ||
        typeof responseData.message !== "string"
      ) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: {
          message: responseData.message,
        },
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async verifyChangeEmailOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string; verification_token: string }>> {
    const parsedData = ChangeEmailVerifyOtpRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${env.API_URL}/auth/change-email/verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al verificar el código OTP.");
      }

      const responseData = await res.json();
      const parsedResult = ChangeEmailVerifyOtpResponseSchema.safeParse(responseData);

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

  async confirmChangeEmail(data: unknown): Promise<ApiResult<User>> {
    const parsedData = ChangeEmailConfirmRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${env.API_URL}/auth/change-email/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (!res.ok) {
        return serverErrorResult(res, "Error al actualizar el correo electrónico.");
      }

      const responseData = await res.json();
      const parsedResult = UserSchema.safeParse(responseData);

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
