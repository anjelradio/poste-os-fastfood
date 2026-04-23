import { categoriesApi } from "../api/categories-api";
import type { CategoryTypeValue } from "@/lib/constants/category.constants";

export const categoriesRepository = {
  getCategories(categoryType?: CategoryTypeValue) {
    return categoriesApi.getCategories(categoryType);
  },
};
