import { env } from "@/lib/config/env";
import { getAccessToken } from "./get-token";
import {
    ProductListSchema,
    ProductsResponseSchema,
} from "../schemas/products.schema";

export async function getProductsByCategory(category: string) {
    const token = await getAccessToken();
    const res = await fetch(`${env.API_URL}/products/category/${category}`, {
        cache: "no-store",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) {
        console.log("Failed");
    }

    const data = await res.json();
    return ProductListSchema.parse(data);
}

export async function getProducts(
    page: number,
    pageSize: number,
    filters?: { productName: string; category: string }
) {
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
    const res = await fetch(`${env.API_URL}/products/?${params}`, {
        cache: "no-store",
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    if (!res.ok) {
        console.log("Failed");
    }

    const data = await res.json();
    return ProductsResponseSchema.parse(data);
}
