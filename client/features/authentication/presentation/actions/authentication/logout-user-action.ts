"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });
    } catch {
      // El logout local continúa aunque falle el registro remoto.
    }
  }

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_role");

  return { ok: true };
}
