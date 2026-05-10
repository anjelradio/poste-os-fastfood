import ProductListCard from "@/features/products/presentation/components/products/ProductListCard";
import ProductSearchHeading from "@/features/products/presentation/components/products/ProductSearchHeading";
import { productsRepository } from "@/features/products/data/repositories/products.repository";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default async function SearchProductPage({
  searchParams,
}: {
  searchParams: Promise<{ product_name?: string; category?: string }>;
}) {
  const params = await searchParams;
  const productName = params.product_name || "";
  const category = params.category || "";

  const response = await productsRepository.getProducts(1, 100, {
    productName,
    category,
  });

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener los productos.");
  }

  return (
    <div className="flex-1 pb-10">
      <ProductSearchHeading productName={productName} category={category} />

      <GradientCard
        gradientId="products-search-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "900px" }}
      >
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">Categoria</div>
          <div className="text-gray-300 font-semibold">Precio</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Productos</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "900px" }}>
          {response.data.products.map((product) => (
            <ProductListCard key={product.id} product={product} />
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
