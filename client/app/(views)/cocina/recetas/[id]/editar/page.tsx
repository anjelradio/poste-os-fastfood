import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditRecipeCard from "@/features/products/presentation/components/recipes/EditRecipeCard";
import { notFound } from "next/navigation";

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

  const ingredients = await Promise.resolve([
    { id: 1, name: "Carne molida", quantity: "0.25", unit: "Kilogramo" },
    { id: 2, name: "Pan burger", quantity: "1", unit: "Unidad" },
  ]);

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Recetas de cocina"
        child={`Editar producto ${id}`}
        backHref="/cocina/recetas"
      />
      <EditRecipeCard productId={productId} ingredients={ingredients} />
    </div>
  );
}
