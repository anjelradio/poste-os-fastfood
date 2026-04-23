import ProductCard from "@/features/products/presentation/components/products/ProductCard";
import OrderSummary from "@/features/orders/presentation/components/OrderSummary";
import CategoryNavbar from "@/features/products/presentation/components/categories/CategoryNavbar";
import { productsRepository } from "@/features/products/data/repositories/products.repository";

export default async function CajaPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const response = await productsRepository.getProductsByCategory(
    resolvedParams.category,
  );

  if (!response.ok) {
    throw new Error(
      response.errors[0] ?? "Error al obtener los productos por categoria.",
    );
  }

  const products = response.data;
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 pb-6 overflow-hidden">
      {/* Products Section - with extra padding for glow effects */}
      <div className="flex-1 lg:flex-7 flex flex-col gap-5 overflow-auto p-2">
        {/* Categories - 3x2 grid on mobile, 6 columns on desktop */}
        <CategoryNavbar />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-4 px-2 py-1">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Order Area - full width on mobile, side panel on desktop */}
      <div className="w-full lg:flex-3 lg:min-w-75">
        <OrderSummary />
      </div>
    </div>
  );
}
