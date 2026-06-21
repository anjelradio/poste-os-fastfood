import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestJson,
  apiRequestStatus,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type { ApiResult, ApiStatusResult } from "@/features/shared/data/types/api-result";
import { toCreateOrderRequestDto, toOrderDetailEntity } from "../mappers/order.mapper";
import { RegisterOrderRequestSchema } from "../schemas/order.schema";
import { OrderDetailResponseSchema } from "../schemas/order-detail-response.schema";
import type { OrderDetail } from "../../domain/entities/order-detail";

const baseUrl = `${env.API_URL}/orders`;

export const ordersApi = {
  async createOrder(data: unknown): Promise<ApiResult<string>> {
    const input = parseWithSchema(RegisterOrderRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(toCreateOrderRequestDto(input.data)),
      cache: 'no-store',
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        const errors = Object.values(errorData).flat() as string[];
        return { ok: false, errors };
      } catch {
        return { ok: false, errors: ['Error al registrar la orden.'] };
      }
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString('base64');
    return { ok: true, data: base64 };
  },

  async getOrderById(id: number): Promise<ApiResult<OrderDetail>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener la orden.",
      responseSchema: OrderDetailResponseSchema,
      mapData: toOrderDetailEntity,
    });
  },

  async updateOrder(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(RegisterOrderRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toCreateOrderRequestDto(input.data),
      fallbackMessage: "Error al actualizar la orden.",
    });
  },
};
