import { recipesApi } from "../api/recipes-api";

export const recipesRepository = {
  getRecipeByProductId(productId: number) {
    return recipesApi.getRecipeByProductId(productId);
  },

  saveRecipeByProductId(productId: number, data: unknown) {
    return recipesApi.saveRecipeByProductId(productId, data);
  },

  deleteRecipeByProductId(productId: number) {
    return recipesApi.deleteRecipeByProductId(productId);
  },
};
