import { LogBookResponseSchema } from "../schemas/logbook.schema";
import { getAccessToken } from "./get-token";
import { env } from "@/lib/config/env";

export async function getLogs(
  page: number,
  pageSize: number,
  filters?: { area: string; date: string },
) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters?.area) {
    params.set("area", filters.area);
  }
  if (filters?.date) {
    params.set("date", filters.date);
  }

  const token = await getAccessToken();
  const res = await fetch(`${env.API_URL}/sistema/logbook/?${params}`, {
    cache: "no-store",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    console.log("Failed");
  }

  const data = await res.json();
  return LogBookResponseSchema.parse(data);
}
