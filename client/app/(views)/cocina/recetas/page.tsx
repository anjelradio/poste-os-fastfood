import { redirect } from "next/navigation";

import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import RecipeListCard from "@/features/products/presentation/components/recipes/RecipeListCard";
import RecipeSearchForm from "@/features/products/presentation/components/recipes/RecipeSearchForm";
import RecipesPagination from "@/features/products/presentation/components/recipes/RecipesPagination";
import { productsRepository } from "@/features/products/data/repositories/products.repository";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; product_name?: string; category?: string }>;
}) {
  const pageQuery = await searchParams;
  const page = +(pageQuery.page ?? "1");
  const pageSize = 8;

  const filters = {
    productName: pageQuery.product_name ?? "",
    category: pageQuery.category ?? "",
  };

  if (page < 1) redirect("/cocina/recetas");

  const response = await productsRepository.getProducts(page, pageSize, {
    ...filters,
    hasRecipe: true,
  });

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las recetas.");
  }

  const recipes = response.data.products;
  const totalRecipes = response.data.total;
  const totalPages = Math.max(1, Math.ceil(totalRecipes / pageSize));

  if (page > totalPages) redirect("/cocina/recetas");

  return (
    <div className="flex-1 pb-10">
      <ReturnHeading titlePage="Recetas de cocina" backHref="/cocina" />

      <RecipeSearchForm />

      <GradientCard
        gradientId="recipes-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "400px" }}
      >
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">Categoría</div>
          <div className="text-gray-300 font-semibold">Precio</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Recetas</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {recipes.map((recipe) => (
            <RecipeListCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </GradientCard>

      <RecipesPagination page={page} totalPages={totalPages} filters={filters} />
    </div>
  );
}
