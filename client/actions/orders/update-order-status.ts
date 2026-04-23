"use server";

import { env } from "@/lib/config/env";
import { getAccessToken } from "@/lib/api/get-token";
import { revalidateTag } from "next/cache";

export async function updateOrderStatus(orderId: number) {
    const token = await getAccessToken();
    const res = await fetch(`${env.API_URL}/orders/${orderId}/change_status/`, {
        method: "POST",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) {
        throw new Error("Error al actualizar estado");
    }

    revalidateTag("orders");

    return { ok: true };
}
