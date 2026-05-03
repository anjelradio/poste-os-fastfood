import { OrderItem } from "@/lib/types";
import { StateCreator } from "zustand";
import { OrderType } from "../../domain/entities/order";
import type { OrderDetail } from "../../domain/entities/order-detail";

type OrderProductInput = {
  id: number;
  name: string;
  price: string;
  image?: string | null;
};

export interface OrderSlice {
  orderItems: OrderItem[];
  orderType: OrderType | null;
  hydrateOrder: (orderDetail: OrderDetail) => void;
  setOrderType: (orderType: OrderType) => void;
  addOrderItem: (product: OrderProductInput) => void;
  increaseOrderItemQuantity: (id: OrderProductInput["id"]) => void;
  decreaseOrderItemQuantity: (id: OrderProductInput["id"]) => void;
  removeOrderItem: (id: OrderProductInput["id"]) => void;
  clearOrder: () => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  orderItems: [],
  orderType: null,
  hydrateOrder: (orderDetail) => {
    set(() => ({
      orderItems: orderDetail.items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        subtotal: Number(item.subtotal),
        price: item.quantity > 0 ? (Number(item.subtotal) / item.quantity).toString() : "0",
        image: "",
      })),
      orderType: orderDetail.orderType,
    }));
  },
  setOrderType: (orderType) => {
    set(() => ({
      orderType,
    }));
  },
  addOrderItem: (product) => {
    let order: OrderItem[] = [];
    if (get().orderItems.find((item) => item.id === product.id)) {
      order = get().orderItems.map((item) =>
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
        ...get().orderItems,
        {
          ...product,
          image: product.image ?? "",
          quantity: 1,
          subtotal: +product.price,
        },
      ];
    }

    set(() => ({
      orderItems: order,
    }));
  },
  increaseOrderItemQuantity: (id) => {
    set((state) => ({
      orderItems: state.orderItems.map((item) =>
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
  decreaseOrderItemQuantity: (id) => {
    const order = get().orderItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
            subtotal: +item.price * Math.max(1, item.quantity - 1),
          }
        : item,
    );
    set(() => ({
      orderItems: order,
    }));
  },
  removeOrderItem: (id) => {
    set((state) => ({
      orderItems: state.orderItems.filter((item) => item.id !== id),
    }));
  },
  clearOrder: () => {
    set(() => ({
      orderItems: [],
      orderType: null,
    }));
  },
});
