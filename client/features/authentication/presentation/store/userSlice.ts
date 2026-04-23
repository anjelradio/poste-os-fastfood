import { StateCreator } from "zustand";
import { User } from "../../domain/entities/user";

export interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
});
