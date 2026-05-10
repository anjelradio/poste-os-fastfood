import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createOrderSlice,
  OrderSlice,
} from "@/features/orders/presentation/store/orderSlice";
import {
  createRecipeSlice,
  RecipeSlice,
} from "@/features/products/presentation/store/recipeSlice";
import {
  createPurchaseSlice,
  PurchaseSlice,
} from "@/features/purchases/presentation/store/purchaseSlice";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { createModalSlice, ModalSlice } from "./slices/modalSlice";
import { createUserSlice, UserSlice } from "@/features/authentication/presentation/store/userSlice";

type AppStore =
  OrderSlice & RecipeSlice & PurchaseSlice & AuthSlice & ModalSlice & UserSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createOrderSlice(...a),
      ...createRecipeSlice(...a),
      ...createPurchaseSlice(...a),
      ...createAuthSlice(...a),
      ...createModalSlice(...a),
      ...createUserSlice(...a)
    }),
    {
      name: "app-storage",
    }
  )
);
