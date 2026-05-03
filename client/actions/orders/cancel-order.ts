"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";

export async function cancelOrder(orderId: number) {
  const token = await getAccessToken();

  const res = await fetch(`${env.API_URL}/orders/${orderId}/cancel/`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    return {
      ok: false,
      errors: ["Error al cancelar la orden"],
    };
  }

  revalidateTag("orders", "max");
  revalidatePath("/caja/ordenes");
  revalidatePath("/caja/ordenes/search");

  return { ok: true };
}
