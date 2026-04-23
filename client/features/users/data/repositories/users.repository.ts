import { usersApi } from "../api/users-api";

export const usersRepository = {
  getUsers(filters?: { username: string; role: string }) {
    return usersApi.getUsers(filters);
  },

  getUserById(id: number) {
    return usersApi.getUserById(id);
  },

  createUser(data: unknown) {
    return usersApi.createUser(data);
  },

  updateProfileInfo(data: unknown) {
    return usersApi.updateProfileInfo(data);
  },

  updateUser(id: number, data: unknown) {
    return usersApi.updateUser(id, data);
  },

  changePassword(data: unknown) {
    return usersApi.changePassword(data);
  },

  requestChangeEmailOtp() {
    return usersApi.requestChangeEmailOtp();
  },

  verifyChangeEmailOtp(data: unknown) {
    return usersApi.verifyChangeEmailOtp(data);
  },

  confirmChangeEmail(data: unknown) {
    return usersApi.confirmChangeEmail(data);
  },

  deleteUser(id: number) {
    return usersApi.deleteUser(id);
  },
};
