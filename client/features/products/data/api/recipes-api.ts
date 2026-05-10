import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestJson,
  apiRequestStatus,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type { ApiResult, ApiStatusResult } from "@/features/shared/data/types/api-result";
import type { RecipeItem } from "../../domain/entities/recipe-item";
import { toRecipeItemsEntity, toSaveRecipeRequestDto } from "../mappers/recipe.mapper";
import { SaveRecipeRequestSchema } from "../schemas/recipe-request.schema";
import { RecipeResponseDtoSchema } from "../schemas/recipe-response.schema";

const baseUrl = `${env.API_URL}/products/recipes`;

export const recipesApi = {
  async getRecipeByProductId(productId: number): Promise<ApiResult<RecipeItem[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/${productId}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener la receta.",
      responseSchema: RecipeResponseDtoSchema,
      mapData: (dto) => toRecipeItemsEntity(dto.items),
    });
  },

  async saveRecipeByProductId(productId: number, data: unknown): Promise<ApiResult<RecipeItem[]>> {
    const input = parseWithSchema(SaveRecipeRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/${productId}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toSaveRecipeRequestDto(input.data),
      fallbackMessage: "Error al guardar la receta.",
      responseSchema: RecipeResponseDtoSchema,
      mapData: (dto) => toRecipeItemsEntity(dto.items),
    });
  },

  async deleteRecipeByProductId(productId: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${productId}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar la receta.",
    });
  },
};
