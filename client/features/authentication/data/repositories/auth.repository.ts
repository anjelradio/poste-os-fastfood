import { authApi } from "../api/auth-api";

export const authRepository = {
  login(data: unknown) {
    return authApi.login(data);
  },

  requestForgotPasswordOtp(data: unknown) {
    return authApi.requestForgotPasswordOtp(data);
  },

  verifyForgotPasswordOtp(data: unknown) {
    return authApi.verifyForgotPasswordOtp(data);
  },
};
