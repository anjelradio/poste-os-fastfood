"use server"
import { env } from "@/lib/config/env";
import { CategoryListSchema } from "../schemas/category.schema";
import { CategoryTypeValue } from "@/lib/constants/category.constants";

export async function getCategories(categoryType?: CategoryTypeValue) {
    const baseUrl = `${env.API_URL}/products/categories`;
    const url = categoryType 
        ? `${baseUrl}?type=${categoryType}`
        : baseUrl;
    
    const res = await fetch(url, {
        cache: "no-store",
    });

    if (!res.ok) {
        console.log("Failed");
    }

    const data = await res.json();
    return CategoryListSchema.parse(data);
}
