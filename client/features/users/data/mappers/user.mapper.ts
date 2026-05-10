import type { User } from "../../domain/entities/user";
import type { UserResponseDto } from "../schemas/users-list-response.schema";

export function toUserEntity(dto: UserResponseDto): User {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    name: dto.name,
    lastName: dto.last_name,
    role: dto.role,
  };
}

export function toUsersListEntity(dtos: UserResponseDto[]): User[] {
  return dtos.map(toUserEntity);
}

type UserMutationData = {
  username: string;
  name: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "CAJA" | "COCINA";
  password?: string;
};

export function toUserMutationRequestDto(data: UserMutationData) {
  return {
    username: data.username,
    name: data.name,
    last_name: data.lastName,
    email: data.email,
    role: data.role,
    ...(data.password !== undefined ? { password: data.password } : {}),
  };
}

type ProfileInfoData = {
  username: string;
  name: string;
  lastName: string;
};

export function toUpdateProfileInfoRequestDto(data: ProfileInfoData) {
  return {
    username: data.username,
    name: data.name,
    last_name: data.lastName,
  };
}

type ChangeEmailConfirmData = {
  verificationToken: string;
  newEmail: string;
};

export function toChangeEmailConfirmRequestDto(data: ChangeEmailConfirmData) {
  return {
    verification_token: data.verificationToken,
    new_email: data.newEmail,
  };
}

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function toChangePasswordRequestDto(data: ChangePasswordData) {
  return {
    current_password: data.currentPassword,
    new_password: data.newPassword,
    confirm_password: data.confirmPassword,
  };
}

type ChangeEmailVerifyOtpEntity = {
  message: string;
  verificationToken: string;
};

export function toChangeEmailVerifyOtpEntity(dto: {
  message: string;
  verification_token: string;
}): ChangeEmailVerifyOtpEntity {
  return {
    message: dto.message,
    verificationToken: dto.verification_token,
  };
}
