"use server";

import { ordersListRepository } from "../../data/repositories/orders-list.repository";
import type { OrdersFilters } from "../../data/mappers/orders-list.mapper";

export async function getOrdersAction(filters: OrdersFilters = {}) {
  return ordersListRepository.getOrders(filters);
}
