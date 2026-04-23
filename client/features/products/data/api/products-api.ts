import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  errorResult,
  serverValidationErrorResult,
  zodValidationErrorResult,
} from "@/features/shared/data/infrastructure/api-error-result";
import {
  type ApiMaybeResult,
  type ApiResult,
  type ApiStatusResult,
} from "@/features/shared/data/types/api-result";
import { ProductSchema, type Product } from "../../domain/entities/product";
import {
  CreateProductRequestSchema,
  UpdateProductRequestSchema,
} from "../schemas/create-product-request.schema";
import { ProductValidationErrorsSchema } from "../schemas/product-validation-errors.schema";
import {
  ProductsListResponseSchema,
  type ProductsListResponse,
} from "../schemas/products-list-response.schema";

const ProductsByCategoryResponseSchema = ProductSchema.array();
type ProductsByCategoryResponse = Product[];

const baseUrl = `${env.API_URL}/products`;

export const productsApi = {
  async getProducts(
    page: number,
    pageSize: number,
    filters?: { productName: string; category: string },
  ): Promise<ApiResult<ProductsListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters?.productName) {
      params.set("productName", filters.productName);
    }
    if (filters?.category) {
      params.set("category", filters.category);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/?${params.toString()}`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al obtener los productos.");
      }

      const responseData = await res.json();
      const parsed = ProductsListResponseSchema.safeParse(responseData);

      if (!parsed.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsed.data,
      };
    } catch {
      return errorResult("Error al obtener los productos.");
    }
  },

  async getProductById(id: number): Promise<ApiMaybeResult<Product>> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 404) {
        return {
          ok: true,
          data: null,
        };
      }

      if (!res.ok) {
        return errorResult("Error al obtener el producto.");
      }

      const responseData = await res.json();
      const parsed = ProductSchema.safeParse(responseData);

      if (!parsed.success) {
        return errorResult("Error en la respuesta del servidor");
      }

      return {
        ok: true,
        data: parsed.data,
      };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async getProductsByCategory(
    categorySlug: string,
  ): Promise<ApiResult<ProductsByCategoryResponse>> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/category/${categorySlug}/`, {
        cache: "no-store",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al obtener los productos por categoria.");
      }

      const responseData = await res.json();
      const parsedData = ProductsByCategoryResponseSchema.safeParse(responseData);

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

  async createProduct(data: unknown): Promise<ApiStatusResult> {
    const parsedData = CreateProductRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (res.status === 400) {
        return serverValidationErrorResult(
          res,
          ProductValidationErrorsSchema,
          "Error al crear el producto.",
        );
      }

      if (!res.ok) {
        return errorResult("Error al crear el producto.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async updateProduct(
    id: number,
    data: unknown,
  ): Promise<ApiStatusResult> {
    const parsedData = UpdateProductRequestSchema.safeParse(data);

    if (!parsedData.success) {
      return zodValidationErrorResult(parsedData.error);
    }

    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(parsedData.data),
      });

      if (res.status === 400) {
        return serverValidationErrorResult(
          res,
          ProductValidationErrorsSchema,
          "Error al actualizar el producto.",
        );
      }

      if (!res.ok) {
        return errorResult("Error al actualizar el producto.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },

  async deleteProduct(id: number): Promise<ApiStatusResult> {
    const token = await getAccessToken();

    try {
      const res = await fetch(`${baseUrl}/${id}/`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        return errorResult("Error al eliminar el producto.");
      }

      return { ok: true };
    } catch {
      return errorResult("Error de conexion. Intenta mas tarde.");
    }
  },
};
