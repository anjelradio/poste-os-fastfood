import { env } from "@/lib/config/env";
import type { CategoryTypeValue } from "@/lib/constants/category.constants";
import { apiRequestJson } from "@/features/shared/data/infrastructure/api/api-client";
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

    return apiRequestJson({
      url,
      method: "GET",
      cache: "no-store",
      fallbackMessage: "Error al obtener las categorias.",
      responseSchema: CategoriesListResponseSchema,
    });
  },
};
