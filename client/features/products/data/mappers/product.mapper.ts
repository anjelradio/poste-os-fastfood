import type { Product } from "../../domain/entities/product";
import type { CreateProductRequest } from "../schemas/create-product-request.schema";
import type { ProductResponseDto } from "../schemas/product-response.schema";

export type ProductsFilters = {
  productName?: string;
  category?: string;
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

  return params;
}
