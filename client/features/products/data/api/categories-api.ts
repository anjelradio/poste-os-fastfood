import { env } from "@/lib/config/env";
import type { CategoryTypeValue } from "@/lib/constants/category.constants";
import { errorResult } from "@/features/shared/data/infrastructure/api-error-result";
import type { ApiResult } from "@/features/shared/data/types/api-result";
import {
  CategoriesListResponseSchema,
  type CategoriesListResponse,
} from "../schemas/categories-list-response.schema";

const baseUrl = `${env.API_URL}/products/categories/`;

export const categoriesApi = {
  async getCategories(
    categoryType?: CategoryTypeValue,
  ): Promise<ApiResult<CategoriesListResponse>> {
    const params = new URLSearchParams();

    if (categoryType) {
      params.set("type", categoryType);
    }

    const query = params.toString();
    const url = query ? `${baseUrl}?${query}` : baseUrl;

    try {
      const res = await fetch(url, {
        cache: "no-store",
      });

      if (!res.ok) {
        return errorResult("Error al obtener las categorias.");
      }

      const responseData = await res.json();
      const parsedData = CategoriesListResponseSchema.safeParse(responseData);

      if (!parsedData.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsedData.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },
};
