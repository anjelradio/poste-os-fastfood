import type { OrderList, OrderListItem } from "../../domain/entities/order-list-item";
import type { OrderListItemResponseDto } from "../schemas/orders-list-response.schema";

export type OrdersFilters = {
  date?: string;
  status?: string;
  type?: string;
  userId?: number;
  clientId?: number;
};

export function toOrdersQueryParams(filters: OrdersFilters = {}) {
  const params = new URLSearchParams();

  if (filters.date) params.set("date", filters.date);
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.userId) params.set("user_id", String(filters.userId));
  if (filters.clientId) params.set("client_id", String(filters.clientId));

  return params;
}

export function toOrderListItemEntity(dto: OrderListItemResponseDto): OrderListItem {
  return {
    id: dto.id,
    orderNumber: dto.order_number,
    createdDate: dto.created_date,
    clientName: dto.client_name,
    total: dto.total,
    type: dto.type,
    status: dto.status,
    readyAt: dto.ready_at,
    items: dto.items,
  };
}

export function toOrderListEntity(dtos: OrderListItemResponseDto[]): OrderList {
  return dtos.map(toOrderListItemEntity);
}
