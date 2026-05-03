import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestJson,
  apiRequestMaybeJson,
  apiRequestStatus,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import {
  type ApiMaybeResult,
  type ApiResult,
  type ApiStatusResult,
} from "@/features/shared/data/types/api-result";
import type { Product } from "../../domain/entities/product";
import {
  toProductEntity,
  toProductEntityList,
  toProductsQueryParams,
  toProductRequestDto,
  type ProductsFilters,
} from "../mappers/product.mapper";
import {
  CreateProductRequestSchema,
  UpdateProductRequestSchema,
} from "../schemas/create-product-request.schema";
import {
  ProductsListResponseSchema,
  type ProductsListResponseDto,
} from "../schemas/products-list-response.schema";
import { ProductResponseDtoSchema } from "../schemas/product-response.schema";

type ProductsListResponse = {
  products: Product[];
  total: number;
};

const baseUrl = `${env.API_URL}/products`;

export const productsApi = {
  async getProducts(
    page: number,
    pageSize: number,
    filters?: ProductsFilters,
  ): Promise<ApiResult<ProductsListResponse>> {
    const params = toProductsQueryParams({ page, pageSize, filters });

    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener los productos.",
      responseSchema: ProductsListResponseSchema,
      mapData: (dto: ProductsListResponseDto) => ({
        products: toProductEntityList(dto.products),
        total: dto.total,
      }),
    });
  },

  async getProductById(id: number): Promise<ApiMaybeResult<Product>> {
    const token = await getAccessToken();

    return apiRequestMaybeJson({
      url: `${baseUrl}/${id}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener el producto.",
      responseSchema: ProductResponseDtoSchema,
      mapData: toProductEntity,
    });
  },

  async getProductsByCategory(
    categorySlug: string,
  ): Promise<ApiResult<Product[]>> {
    const token = await getAccessToken();

    return apiRequestJson({
      url: `${baseUrl}/category/${categorySlug}/`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al obtener los productos por categoria.",
      responseSchema: ProductResponseDtoSchema.array(),
      mapData: toProductEntityList,
    });
  },

  async createProduct(data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(CreateProductRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/`,
      method: "POST",
      token: token ?? undefined,
      body: toProductRequestDto(input.data),
      fallbackMessage: "Error al crear el producto.",
    });
  },

  async updateProduct(id: number, data: unknown): Promise<ApiStatusResult> {
    const input = parseWithSchema(UpdateProductRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "PUT",
      token: token ?? undefined,
      body: toProductRequestDto(input.data),
      fallbackMessage: "Error al actualizar el producto.",
    });
  },

  async deleteProduct(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    return apiRequestStatus({
      url: `${baseUrl}/${id}/`,
      method: "DELETE",
      token: token ?? undefined,
      fallbackMessage: "Error al eliminar el producto.",
    });
  },
};
