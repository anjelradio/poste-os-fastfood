import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createOrderSlice,
  OrderSlice,
} from "@/features/orders/presentation/store/orderSlice";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { createModalSlice, ModalSlice } from "./slices/modalSlice";
import { createUserSlice, UserSlice } from "@/features/authentication/presentation/store/userSlice";

type AppStore = OrderSlice & AuthSlice & ModalSlice & UserSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createOrderSlice(...a),
      ...createAuthSlice(...a),
      ...createModalSlice(...a),
      ...createUserSlice(...a)
    }),
    {
      name: "app-storage",
    }
  )
);
