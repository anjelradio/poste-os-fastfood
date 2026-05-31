import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { getTopSoldProductsListAction } from "@/features/products/presentation/actions/product-actions";
import CustomFieldedFormDate from "@/features/shared/components/forms/CustomFieldedFormDate";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function TopProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ from_date?: string; to_date?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();

  const fromDate = params.from_date ?? `${today.getFullYear()}-01-01`;
  const toDate = params.to_date ?? formatDateInput(today);

  const response = await getTopSoldProductsListAction({
    fromDate,
    toDate,
  });

  const items = response.ok ? response.data.items : [];

  return (
    <div className="flex-1 pb-10">
      <ReturnHeading titlePage="Top Productos" backHref="/administracion" />

      <GradientCard
        gradientId="filters-card"
        className="mb-6"
        contentClassName="p-6 rounded-2xl"
      >
        <form method="GET">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <CustomFieldedFormDate
                name="from_date"
                label="Desde"
                defaultValue={fromDate}
              />
            </div>

            <div className="md:col-span-1">
              <CustomFieldedFormDate
                name="to_date"
                label="Hasta"
                defaultValue={toDate}
              />
            </div>

            <div className="md:col-span-1">
              <SearchSubmitButton pendingText="BUSCANDO...">
                BUSCAR TOP PRODUCTOS
              </SearchSubmitButton>
            </div>
          </div>
        </form>
      </GradientCard>

      <GradientCard
        gradientId="top-products-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "440px" }}
      >
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Producto</div>
          <div className="text-gray-300 font-semibold">Cantidad vendida</div>
          <div className="text-gray-300 font-semibold">Apariciones en ordenes</div>
          <div className="text-gray-300 font-semibold">Ingresos</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Top Productos</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
          {!response.ok ? (
            <p className="px-6 py-5 text-red-300 text-sm">
              {response.errors[0] ?? "Error al obtener top productos."}
            </p>
          ) : items.length === 0 ? (
            <p className="px-6 py-5 text-gray-300 text-sm">
              No se encontraron productos vendidos en el rango seleccionado.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/20 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md border border-white/20 bg-white/5 flex-shrink-0" />
                  )}
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                </div>

                <div className="text-gray-100 text-sm">{item.quantitySold}</div>
                <div className="text-gray-100 text-sm">{item.ordersCount}</div>
                <div className="text-amber-200 text-sm font-medium">Bs. {item.revenue}</div>
              </div>
            ))
          )}
        </div>
      </GradientCard>
    </div>
  );
}
