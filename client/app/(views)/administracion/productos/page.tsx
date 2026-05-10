import { redirect } from "next/navigation";

import CustomLinkButton from "@/features/shared/components/ui/CustomLinkButton";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import ProductListCard from "@/features/products/presentation/components/products/ProductListCard";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ProductsPagination from "@/features/products/presentation/components/products/ProductsPagination";
import ProductSearchForm from "@/features/products/presentation/components/products/ProductSearchForm";
import { productsRepository } from "@/features/products/data/repositories/products.repository";

export default async function ProductsPage({
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

  if (page < 1) redirect("/administracion/productos");

  const response = await productsRepository.getProducts(
    page,
    pageSize,
    filters,
  );
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener los productos.");
  }

  const products = response.data.products;
  const totalProducts = response.data.total;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));

  if (page > totalPages) redirect("/administracion/productos");

  return (
    <div className="flex-1 pb-10">
      {/* Title with Back Button */}
      <ReturnHeading titlePage="Gestión del Catálogo" backHref="/administracion" />

      {/* Create Product Button */}
      <CustomLinkButton pageUrl="/administracion/productos/agregar" />

      {/* Filters Card */}
      <ProductSearchForm />

      {/* Products Table Card */}
      <GradientCard
        gradientId="products-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "400px" }}
      >
        {/* Table Header - Sticky - Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">Categoría</div>
          <div className="text-gray-300 font-semibold">Precio</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        {/* Table Header - Mobile */}
        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Productos</div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {products.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>
      </GradientCard>
      <ProductsPagination
        page={page}
        totalPages={totalPages}
        filters={filters}
      />
    </div>
  );
}
