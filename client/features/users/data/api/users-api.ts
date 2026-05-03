import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import { z } from "zod";
import { errorResult } from "@/features/shared/data/infrastructure/api-error-result";
import {
  apiRequestJson,
  apiRequestMaybeJson,
  apiRequestStatus,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type {
  ApiMaybeResult,
  ApiResult,
  ApiStatusResult,
} from "@/features/shared/data/types/api-result";
import type { User } from "../../domain/entities/user";
import {
  toChangePasswordRequestDto,
  toChangeEmailConfirmRequestDto,
  toChangeEmailVerifyOtpEntity,
  toUpdateProfileInfoRequestDto,
  toUserEntity,
  toUserMutationRequestDto,
  toUsersListEntity,
} from "../mappers/user.mapper";
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
  UserResponseDtoSchema,
  UsersListResponseSchema,
} from "../schemas/users-list-response.schema";

const baseUrl = `${env.API_URL}/users`;

const MessageResponseSchema = z.object({
  message: z.string(),
});

export const usersApi = {
  async getUsers(filters?: {
    username: string;
    role: string;
  }): Promise<ApiResult<User[]>> {
    const params = new URLSearchParams();

    if (filters?.username) {
      params.set("username", filters.username);
    }

    if (filters?.role) {
      params.set("role", filters.role);
    }

    const token = await getAccessToken();
    const query = params.toString();

    return apiRequestJson({
      url: query ? `${baseUrl}/?${query}` : `${baseUrl}/`,
      method: "GET",
      token: token ?? undefined,
      cache: "no-store",
      fallbackMessage: "Error al obtener los usuarios.",
      responseSchema: UsersListResponseSchema,
      mapData: toUsersListEntity,
    });
  },

  async getUserById(id: number): Promise<ApiMaybeResult<User>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      token: token ?? undefined,
      cache: "no-store",
      fallbackMessage: "Error al obtener el usuario.",
      responseSchema: UserResponseDtoSchema,
      mapData: toUserEntity,
    });
  },

  async createUser(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(CreateUserRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/`,
      method: "POST",
      token: token ?? undefined,
      body: toUserMutationRequestDto(input.data),
      fallbackMessage: "Error al crear el usuario.",
    });
  },

  async updateProfileInfo(data: unknown): Promise<ApiResult<User>> {
    const input = parseWithSchema(UpdateProfileInfoRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${env.API_URL}/auth/update-info/`,
      method: "PUT",
      token: token ?? undefined,
      body: toUpdateProfileInfoRequestDto(input.data),
      fallbackMessage: "Error al actualizar la información.",
      responseSchema: UserResponseDtoSchema,
      mapData: toUserEntity,
    });
  },

  async updateUser(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(UpdateUserRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const payload =
      input.data.password === ""
        ? toUserMutationRequestDto({ ...input.data, password: undefined })
        : toUserMutationRequestDto(input.data);

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: payload,
      fallbackMessage: "Error al actualizar el usuario.",
    });
  },

  async deleteUser(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar el usuario.",
    });
  },

  async changePassword(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(ChangePasswordRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${env.API_URL}/auth/change-password/`,
      method: "PUT",
      token: token ?? undefined,
      body: toChangePasswordRequestDto(input.data),
      fallbackMessage: "Error al actualizar la contraseña.",
    });
  },

  async requestChangeEmailOtp(): Promise<ApiResult<{ message: string }>> {
    const token = await getAccessToken();

    if (!token) {
      return errorResult("No autorizado");
    }

    return apiRequestJson({
      url: `${env.API_URL}/auth/change-email/request-otp/`,
      method: "POST",
      token,
      fallbackMessage: "Error al solicitar el código OTP.",
      responseSchema: MessageResponseSchema,
    });
  },

  async verifyChangeEmailOtp(
    data: unknown,
  ): Promise<ApiResult<{ message: string; verificationToken: string }>> {
    const input = parseWithSchema(ChangeEmailVerifyOtpRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${env.API_URL}/auth/change-email/verify-otp/`,
      method: "POST",
      token: token ?? undefined,
      body: input.data,
      fallbackMessage: "Error al verificar el código OTP.",
      responseSchema: ChangeEmailVerifyOtpResponseSchema,
      mapData: toChangeEmailVerifyOtpEntity,
    });
  },

  async confirmChangeEmail(data: unknown): Promise<ApiResult<User>> {
    const input = parseWithSchema(ChangeEmailConfirmRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${env.API_URL}/auth/change-email/confirm/`,
      method: "POST",
      token: token ?? undefined,
      body: toChangeEmailConfirmRequestDto(input.data),
      fallbackMessage: "Error al actualizar el correo electrónico.",
      responseSchema: UserResponseDtoSchema,
      mapData: toUserEntity,
    });
  },
};
