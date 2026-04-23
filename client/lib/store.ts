import { create } from "zustand";
import { OrderItem } from "./types";
import type { Product } from "@/features/products/domain/entities/product";

interface Store {
    order: OrderItem[];
    addToOrder: (product: Product) => void;
    increaseQuantity: (id: Product["id"]) => void;
    decreaseQuantity: (id: Product["id"]) => void;
    removeItem: (id: Product["id"]) => void;
    clearOrder: () => void;
}

export const useAppStore = create<Store>((set, get) => ({
    order: [],
    addToOrder: (product) => {
        const data = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image ?? "",
        };
        let order: OrderItem[] = [];
        if (get().order.find((item) => item.id === product.id)) {
            order = get().order.map((item) =>
                item.id === product.id
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          subtotal: +item.price * (item.quantity + 1),
                      }
                    : item,
            );
        } else {
            order = [
                ...get().order,
                {
                    ...data,
                    quantity: 1,
                    subtotal: 1 * +product.price,
                },
            ];
        }

        set(() => ({
            order,
        }));
    },
    increaseQuantity: (id) => {
        set((state) => ({
            order: state.order.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          subtotal: +item.price * (item.quantity + 1),
                      }
                    : item,
            ),
        }));
    },
    decreaseQuantity: (id) => {
        const order = get().order.map((item) =>
            item.id === id
                ? {
                      ...item,
                      quantity: item.quantity - 1,
                      subtotal: +item.price * (item.quantity - 1),
                  }
                : item,
        );
        set(() => ({
            order,
        }));
    },
    removeItem: (id) => {
        set((state) => ({
            order: state.order.filter((item) => item.id !== id),
        }));
    },
    clearOrder: () => {
        set(() => ({
            order: [],
        }));
    },
}));
