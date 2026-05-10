import { ordersListApi } from "../api/orders-list-api";
import type { OrdersFilters } from "../mappers/orders-list.mapper";

export const ordersListRepository = {
  getOrders(filters: OrdersFilters = {}) {
    return ordersListApi.getOrders(filters);
  },
};
