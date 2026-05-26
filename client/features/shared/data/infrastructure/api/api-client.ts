import type { ZodType } from "zod";

import {
  errorResult,
  serverErrorResult,
} from "@/features/shared/data/infrastructure/api-error-result";
import type {
  ApiFileData,
  ApiMaybeFileResult,
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

type MaybeFileRequestConfig = RequestConfig & {
  fallbackMessage: string;
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

function getFileNameFromDisposition(contentDisposition: string | null) {
  if (!contentDisposition) {
    return "reporte.pdf";
  }

  const match = contentDisposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? "reporte.pdf";
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

export async function apiRequestMaybeFile(
  config: MaybeFileRequestConfig,
): Promise<ApiMaybeFileResult> {
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

    const arrayBuffer = await res.arrayBuffer();
    const fileData: ApiFileData = {
      bytes: Array.from(new Uint8Array(arrayBuffer)),
      contentType: res.headers.get("content-type") ?? "application/pdf",
      fileName: getFileNameFromDisposition(res.headers.get("content-disposition")),
    };

    return {
      ok: true,
      data: fileData,
    };
  } catch {
    return errorResult("Error de conexion. Intenta mas tarde.");
  }
}
