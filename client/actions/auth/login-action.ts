"use server";

import { cookies } from "next/headers";
import { env } from "@/lib/config/env";
import { CredentialsSchema, LoginResponseSchema } from "@/lib/schemas/auth.schema";

interface LoginResult {
    ok: boolean;
    tokens?: { access: string; refresh: string };
    user?: {
        id: number;
        username: string;
        email: string;
        name: string;
        last_name: string;
        role: "CAJA" | "COCINA" | "ADMIN";
    };
    error?: string;
    errors?: string[];
}

export async function login(data: unknown): Promise<LoginResult> {
    const result = CredentialsSchema.safeParse(data);

    if (!result.success) {
        const errors = result.error.issues.map(issue => issue.message);
        return { ok: false, errors };
    }

    const { username, password } = result.data;

    try {
        const res = await fetch(`${env.API_URL}/auth/login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 400) {
            const errorData = await res.json();
            return { ok: false, errors: errorData.errors };
        }

        if (!res.ok) {
            return { ok: false, error: "Credenciales inválidas" };
        }

        const rawData = await res.json();
        const data = LoginResponseSchema.parse(rawData);

        const cookieStore = await cookies();
        cookieStore.set("access_token", data.tokens.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        cookieStore.set("refresh_token", data.tokens.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return {
            ok: true,
            tokens: data.tokens,
            user: data.user,
        };
    } catch {
        return { ok: false, error: "Error de conexión. Intenta más tarde." };
    }
}
