import type { ZodType } from "zod";

import {
  errorResult,
  serverErrorResult,
} from "@/features/shared/data/infrastructure/api-error-result";
import type {
  ApiMaybeResult,
  ApiResult,
  ApiStatusResult,
} from "@/features/shared/data/types/api-result";

type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig = {
  url: string;
  method: ApiMethod;
  token?: string;
  cache?: RequestCache;
  body?: unknown;
};

type JsonRequestConfig<TParsed, TResult> = RequestConfig & {
  fallbackMessage: string;
  responseSchema: ZodType<TParsed>;
  mapData?: (data: TParsed) => TResult;
};

type StatusRequestConfig = RequestConfig & {
  fallbackMessage: string;
};

type MaybeJsonRequestConfig<TParsed, TResult> = JsonRequestConfig<TParsed, TResult> & {
  notFoundStatus?: number;
};

function buildHeaders(token?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(config: RequestConfig) {
  return fetch(config.url, {
    method: config.method,
    headers: buildHeaders(config.token),
    cache: config.cache,
    ...(config.body !== undefined ? { body: JSON.stringify(config.body) } : {}),
  });
}

export async function apiRequestJson<TParsed, TResult = TParsed>(
  config: JsonRequestConfig<TParsed, TResult>,
): Promise<ApiResult<TResult>> {
  try {
    const res = await request(config);
    if (!res.ok) {
      return serverErrorResult(res, config.fallbackMessage);
    }

    const responseData = await res.json();
    const parsedResult = config.responseSchema.safeParse(responseData);
    if (!parsedResult.success) {
      return errorResult("Error en la respuesta del servidor");
    }

    return {
      ok: true,
      data: config.mapData
        ? config.mapData(parsedResult.data)
        : (parsedResult.data as unknown as TResult),
    };
  } catch {
    return errorResult("Error de conexion. Intenta mas tarde.");
  }
}

export async function apiRequestStatus(
  config: StatusRequestConfig,
): Promise<ApiStatusResult> {
  try {
    const res = await request(config);
    if (!res.ok) {
      return serverErrorResult(res, config.fallbackMessage);
    }

    return { ok: true };
  } catch {
    return errorResult("Error de conexion. Intenta mas tarde.");
  }
}

export async function apiRequestMaybeJson<TParsed, TResult = TParsed>(
  config: MaybeJsonRequestConfig<TParsed, TResult>,
): Promise<ApiMaybeResult<TResult>> {
  try {
    const res = await request(config);
    if (res.status === (config.notFoundStatus ?? 404)) {
      return {
        ok: true,
        data: null,
      };
    }

    if (!res.ok) {
      return serverErrorResult(res, config.fallbackMessage);
    }

    const responseData = await res.json();
    const parsedResult = config.responseSchema.safeParse(responseData);
    if (!parsedResult.success) {
      return errorResult("Error en la respuesta del servidor");
    }

    return {
      ok: true,
      data: config.mapData
        ? config.mapData(parsedResult.data)
        : (parsedResult.data as unknown as TResult),
    };
  } catch {
    return errorResult("Error de conexion. Intenta mas tarde.");
  }
}
