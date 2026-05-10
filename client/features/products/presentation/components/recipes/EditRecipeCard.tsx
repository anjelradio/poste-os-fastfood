"use client";

import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import SectionDivider from "@/features/shared/components/ui/SectionDivider";
import RecipeAddIngredientForm from "./RecipeAddIngredientForm";
import RecipeItem from "./RecipeItem";

export default function EditRecipeCard({ productId, ingredients }: any) {

  const handleAddIngredient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const targetProductId = formData.get("productId");
    void targetProductId;
  };

  const handleSaveRecipe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const targetProductId = formData.get("productId");
    void targetProductId;
  };

  return (
    <GradientFormCard gradientId="edit-recipe-form" title="Editar receta">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="text-gray-300 text-sm font-semibold">Ingredientes actuales</div>
          {ingredients.map((item: any) => (
            <RecipeItem key={item.id} item={item} />
          ))}
        </div>

        <SectionDivider label="AGREGAR NUEVO INGREDIENTE" />

        <RecipeAddIngredientForm onSubmit={handleAddIngredient} productId={productId} />

        <form onSubmit={handleSaveRecipe}>
          <input type="hidden" name="productId" value={productId} />
          <FormSubmitButton pendingText="Guardando...">GUARDAR CAMBIOS</FormSubmitButton>
        </form>
      </div>
    </GradientFormCard>
  );
}
