"use server";

import { env } from "@/lib/config/env";
import { getAccessToken } from "@/lib/api/get-token";
import { ProfileInfoFormSchema } from "@/lib/schemas/auth.schema";

export async function updateUserInfo(data: unknown) {
    const result = ProfileInfoFormSchema.safeParse(data);

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        return { ok: false, errors };
    }

    const token = await getAccessToken();
    const res = await fetch(`${env.API_URL}/auth/update-info/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(result.data),
    });

    if (res.status === 400) {
        const errorData = await res.json();
        return { ok: false, errors: errorData.errors };
    }

    if (!res.ok) {
        return { ok: false, errors: ["Error al actualizar la información"] };
    }

    const dataResponse = await res.json();
    return { ok: true, data: dataResponse };
}
