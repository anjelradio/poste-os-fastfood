import { StateCreator } from "zustand";
import type { RecipeItem } from "../../domain/entities/recipe-item";

export type RecipeItemInput = {
  rawMaterialId: number;
  rawMaterialName: string;
  measureUnitId: number;
  measureUnitName: string;
  quantity: number;
};

export interface RecipeSlice {
  recipeItems: RecipeItem[];
  hydrateRecipe: (items: RecipeItem[]) => void;
  addRecipeItem: (item: RecipeItemInput) => void;
  removeRecipeItem: (rawMaterialId: number) => void;
  clearRecipe: () => void;
}

export const createRecipeSlice: StateCreator<RecipeSlice> = (set, get) => ({
  recipeItems: [],
  hydrateRecipe: (items) => {
    set(() => ({ recipeItems: items }));
  },
  addRecipeItem: (item) => {
    const existing = get().recipeItems.find(
      (current) => current.rawMaterialId === item.rawMaterialId,
    );

    if (existing) {
      set((state) => ({
        recipeItems: state.recipeItems.map((current) =>
          current.rawMaterialId === item.rawMaterialId
            ? {
                ...current,
                quantity: current.quantity + item.quantity,
                measureUnitId: item.measureUnitId,
                measureUnitName: item.measureUnitName,
              }
            : current,
        ),
      }));
      return;
    }

    set((state) => ({
      recipeItems: [...state.recipeItems, item],
    }));
  },
  removeRecipeItem: (rawMaterialId) => {
    set((state) => ({
      recipeItems: state.recipeItems.filter(
        (item) => item.rawMaterialId !== rawMaterialId,
      ),
    }));
  },
  clearRecipe: () => {
    set(() => ({ recipeItems: [] }));
  },
});
