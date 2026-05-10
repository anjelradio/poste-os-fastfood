import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditRecipeCard from "@/features/products/presentation/components/recipes/EditRecipeCard";
import { notFound } from "next/navigation";
import { getRecipeByProductIdAction } from "@/features/products/presentation/actions/recipe-actions";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId) || productId < 1) {
    notFound();
  }

  const [recipeResponse, rawMaterialsResponse, measureUnitsResponse] = await Promise.all([
    getRecipeByProductIdAction(productId),
    inventoryRepository.getRawMaterials(),
    inventoryRepository.getMeasureUnits(),
  ]);

  if (!recipeResponse.ok) {
    throw new Error(recipeResponse.errors[0] ?? "Error al obtener la receta.");
  }

  if (!rawMaterialsResponse.ok) {
    throw new Error(rawMaterialsResponse.errors[0] ?? "Error al obtener materias primas.");
  }

  if (!measureUnitsResponse.ok) {
    throw new Error(
      measureUnitsResponse.errors[0] ?? "Error al obtener unidades de medida.",
    );
  }

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Recetas de cocina"
        child={`Editar producto ${id}`}
        backHref="/cocina/recetas"
      />
      <EditRecipeCard
        productId={productId}
        initialRecipeItems={recipeResponse.data}
        rawMaterials={rawMaterialsResponse.data}
        measureUnits={measureUnitsResponse.data}
      />
    </div>
  );
}
