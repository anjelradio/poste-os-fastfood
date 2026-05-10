"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import SectionDivider from "@/features/shared/components/ui/SectionDivider";
import RecipeAddIngredientForm from "./RecipeAddIngredientForm";
import RecipeItem from "./RecipeItem";
import { useAppStore } from "@/lib/store/appStore";
import { saveRecipeByProductIdAction } from "../../actions/recipe-actions";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import type { RecipeItem as RecipeItemEntity } from "@/features/products/domain/entities/recipe-item";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import type { MeasureUnit } from "@/features/inventory/domain/entities/measure-unit";

export default function EditRecipeCard({
  productId,
  initialRecipeItems,
  rawMaterials,
  measureUnits,
}: {
  productId: number;
  initialRecipeItems: RecipeItemEntity[];
  rawMaterials: RawMaterial[];
  measureUnits: MeasureUnit[];
}) {
  const router = useRouter();
  const {
    recipeItems,
    hydrateRecipe,
    addRecipeItem,
    removeRecipeItem,
    clearRecipe,
  } = useAppStore();

  useEffect(() => {
    hydrateRecipe(initialRecipeItems);
    return () => clearRecipe();
  }, [initialRecipeItems, hydrateRecipe, clearRecipe]);

  const handleAddIngredient = (payload: {
    rawMaterialId: number;
    rawMaterialName: string;
    measureUnitId: number;
    measureUnitName: string;
    quantity: number;
  }) => {
    addRecipeItem(payload);
    showSuccessToast("Ingrediente agregado correctamente");
  };

  const handleSaveRecipe = async (formData: FormData) => {
    void formData;
    const response = await saveRecipeByProductIdAction(productId, {
      items: recipeItems.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        measureUnitId: item.measureUnitId,
        quantity: item.quantity,
      })),
    });

    if (!response.ok) {
      showErrorToast(response.errors[0] ?? "Error al guardar la receta");
      return;
    }

    hydrateRecipe(response.data);
    showSuccessToast("Receta guardada correctamente");
    router.push("/cocina/recetas");
    router.refresh();
  };

  return (
    <GradientFormCard gradientId="edit-recipe-form" title="Editar receta">
      <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-gray-300 text-sm font-semibold">Ingredientes actuales</div>
            {recipeItems.length === 0 ? (
              <div className="text-sm text-gray-400 italic">No hay ingredientes agregados</div>
            ) : (
              recipeItems.map((item) => (
                <RecipeItem
                  key={item.rawMaterialId}
                  item={item}
                  onDelete={() => removeRecipeItem(item.rawMaterialId)}
                />
              ))
            )}
          </div>

        <SectionDivider label="AGREGAR NUEVO INGREDIENTE" />

        <RecipeAddIngredientForm
          onSubmit={handleAddIngredient}
          productId={productId}
          rawMaterials={rawMaterials}
          measureUnits={measureUnits}
        />

        <form action={handleSaveRecipe}>
          <input type="hidden" name="productId" value={productId} />
          <FormSubmitButton pendingText="Guardando...">GUARDAR CAMBIOS</FormSubmitButton>
        </form>
      </div>
    </GradientFormCard>
  );
}
