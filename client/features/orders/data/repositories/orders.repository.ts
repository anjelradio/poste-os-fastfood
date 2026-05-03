import { ordersApi } from "../api/orders-api";

export const ordersRepository = {
  createOrder(data: unknown) {
    return ordersApi.createOrder(data);
  },

  getOrderById(id: number) {
    return ordersApi.getOrderById(id);
  },

  updateOrder(id: number, data: unknown) {
    return ordersApi.updateOrder(id, data);
  },
};
