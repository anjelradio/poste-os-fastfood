import { notFound } from "next/navigation";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import ProductForm from "@/features/products/presentation/components/products/ProductForm";
import EditProductForm from "@/features/products/presentation/components/products/EditProductForm";
import { productsRepository } from "@/features/products/data/repositories/products.repository";
import { categoriesRepository } from "@/features/products/data/repositories/categories.repository";
import { CategoryType } from "@/lib/constants/category.constants";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const categoriesResponse = await categoriesRepository.getCategories(
    CategoryType.PRODUCT,
  );

  if (!categoriesResponse.ok) {
    throw new Error(
      categoriesResponse.errors[0] ?? "Error al obtener las categorias.",
    );
  }
  const param = await params;
  const response = await productsRepository.getProductById(+param.id);

  if (!response.ok || !response.data) {
    notFound();
  }

  const product = response.data;
  const categories = categoriesResponse.data;
  return (
    <div className="flex-1 pb-10">
      {/* Breadcrumb and Back Button */}
      <Breadcrumb
        parent="Gestión del Catálogo"
        child={`Editar ${product.name}`}
        backHref="/administracion/productos"
      />
      <EditProductForm>
        <ProductForm product={product} categories={categories} />
      </EditProductForm>
    </div>
  );
}
