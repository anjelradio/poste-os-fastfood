import { categoriesRepository } from "@/features/products/data/repositories/categories.repository";
import AddProductForm from "@/features/products/presentation/components/products/AddProductForm";
import ProductForm from "@/features/products/presentation/components/products/ProductForm";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { CategoryType } from "@/lib/constants/category.constants";

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const response = await categoriesRepository.getCategories(
    CategoryType.PRODUCT,
  );

  const categories = response.ok ? response.data : [];

  return (
    <div className="flex-1 pb-10">
      {/* Breadcrumb and Back Button */}
      <Breadcrumb
        parent="Gestión del Catálogo"
        child="Agregar Producto"
        backHref="/administracion/productos"
      />
      <AddProductForm>
        <ProductForm categories={categories} />
      </AddProductForm>
    </div>
  );
}
