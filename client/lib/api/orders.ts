"use server";
import { env } from "@/lib/config/env";
import { getAccessToken } from "./get-token";
import { Order, OrderListSchema } from "../schemas/order.schema";

export async function createOrder(data: Order) {
  console.log(data);
  const token = await getAccessToken();
  const res = await fetch(`${env.API_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (res.status === 201) {
    return { ok: true };
  }

  if (res.status === 400) {
    const errorData = await res.json();
    return {
      ok: false,
      errors: errorData.errors,
    };
  }
  throw new Error("Error inesperado al crear la orden");
}

export interface OrderFilters {
  date?: string;
  status?: string;
  type?: string;
}

export async function getOrders(filters: OrderFilters = {}) {
  const params = new URLSearchParams();

  if (filters.date) params.append("date", filters.date);
  if (filters.status) params.append("status", filters.status);
  if (filters.type) params.append("type", filters.type);

  const queryString = params.toString();
  const url = queryString
    ? `${env.API_URL}/orders/?${queryString}`
    : `${env.API_URL}/orders/`;

  const token = await getAccessToken();
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    next: { tags: ["orders"] },
  });

  if (!res.ok) {
    throw new Error("Error al obtener las órdenes");
  }

  const data = await res.json();
  const result = OrderListSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation error:", result.error);
    throw new Error("Error al validar las órdenes");
  }

  return result.data;
}
