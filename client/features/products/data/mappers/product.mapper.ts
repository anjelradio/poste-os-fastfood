import type { Product } from "../../domain/entities/product";
import type { CreateProductRequest } from "../schemas/create-product-request.schema";
import type { ProductResponseDto } from "../schemas/product-response.schema";
import type { TopSoldProductItemDto } from "../schemas/top-sold-products-response.schema";

export type ProductsFilters = {
  productName?: string;
  category?: string;
  hasRecipe?: boolean;
};

export type TopSoldMode = "summary" | "list";

export type TopSoldFilters = {
  mode?: TopSoldMode;
  fromDate?: string;
  toDate?: string;
};

export type TopSoldProductItem = {
  productId: number;
  name: string;
  image: string | null;
  quantitySold: number;
  ordersCount: number;
  revenue: string;
};

export function toProductEntity(dto: ProductResponseDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    image: dto.image,
    slug: dto.slug,
    hasRecipe: dto.has_recipe,
    category: dto.category,
  };
}

export function toProductEntityList(dtos: ProductResponseDto[]): Product[] {
  return dtos.map(toProductEntity);
}

export function toProductRequestDto(data: CreateProductRequest) {
  return {
    name: data.name,
    price: data.price,
    category: data.category,
    has_recipe: data.hasRecipe,
    image: data.image,
  };
}

export function toTopSoldProductItem(dto: TopSoldProductItemDto): TopSoldProductItem {
  return {
    productId: dto.productId,
    name: dto.name,
    image: dto.image,
    quantitySold: dto.quantitySold,
    ordersCount: dto.ordersCount,
    revenue: String(dto.revenue),
  };
}

export function toTopSoldProductItemList(
  dtos: TopSoldProductItemDto[],
): TopSoldProductItem[] {
  return dtos.map(toTopSoldProductItem);
}

export function toTopSoldProductsQueryParams(filters: TopSoldFilters) {
  const mode = filters.mode ?? "summary";
  const params = new URLSearchParams({ mode });

  if (mode === "list") {
    if (filters.fromDate) {
      params.set("from_date", filters.fromDate);
    }

    if (filters.toDate) {
      params.set("to_date", filters.toDate);
    }
  }

  return params;
}

export function toProductsQueryParams(input: {
  page: number;
  pageSize: number;
  filters?: ProductsFilters;
}) {
  const params = new URLSearchParams({
    page: input.page.toString(),
    page_size: input.pageSize.toString(),
  });

  if (input.filters?.productName) {
    params.set("product_name", input.filters.productName);
  }

  if (input.filters?.category) {
    params.set("category", input.filters.category);
  }

  if (input.filters?.hasRecipe !== undefined) {
    params.set("has_recipe", String(input.filters.hasRecipe));
  }

  return params;
}

export function toProductsSearchQuery(filters?: ProductsFilters) {
  const params = new URLSearchParams();

  if (filters?.productName) {
    params.set("product_name", filters.productName);
  }

  if (filters?.category) {
    params.set("category", filters.category);
  }

  if (filters?.hasRecipe !== undefined) {
    params.set("has_recipe", String(filters.hasRecipe));
  }

  return params;
}
