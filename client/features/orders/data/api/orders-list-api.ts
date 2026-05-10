import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import { apiRequestJson } from "@/features/shared/data/infrastructure/api/api-client";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import type { OrderList } from "../../domain/entities/order-list-item";
import {
  toOrderListEntity,
  toOrdersQueryParams,
  type OrdersFilters,
} from "../mappers/orders-list.mapper";
import {
  OrdersListResponseSchema,
  type OrderListItemResponseDto,
} from "../schemas/orders-list-response.schema";

const baseUrl = `${env.API_URL}/orders`;

export const ordersListApi = {
  async getOrders(filters: OrdersFilters = {}): Promise<ApiResult<OrderList>> {
    const token = await getAccessToken();
    const params = toOrdersQueryParams(filters);

    return apiRequestJson({
      url: `${baseUrl}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener las órdenes.",
      responseSchema: OrdersListResponseSchema,
      mapData: (dto: OrderListItemResponseDto[]) => toOrderListEntity(dto),
    });
  },
};
