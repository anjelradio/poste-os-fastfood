import { redirect } from "next/navigation";
import CustomLinkButton from "@/features/shared/components/ui/CustomLinkButton";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import PurchaseFiltersForm from "@/features/purchases/presentation/components/purchases/PurchaseFiltersForm";
import PurchaseListCard from "@/features/purchases/presentation/components/purchases/PurchaseListCard";
import PurchasesPagination from "@/features/purchases/presentation/components/purchases/PurchasesPagination";
import { purchasesRepository } from "@/features/purchases/data/repositories/purchases.repository";

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; date?: string }>;
}) {
  const query = await searchParams;
  const page = +(query.page ?? "1");
  const pageSize = 8;

  const filters = {
    date: query.date ?? "",
  };

  if (page < 1) redirect("/administracion/compras-y-proveedores/compras");

  const response = await purchasesRepository.getPurchases(page, pageSize, filters);
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las compras.");
  }

  const purchases = response.data.purchases;
  const totalPurchases = response.data.total;
  const totalPages = Math.max(1, Math.ceil(totalPurchases / pageSize));

  if (page > totalPages) redirect("/administracion/compras-y-proveedores/compras");

  return (
    <div className="flex-1 pb-10">
      <ReturnHeading
        titlePage="Gestión de Compras"
        backHref="/administracion/compras-y-proveedores"
      />

      <CustomLinkButton
        pageUrl="/administracion/compras-y-proveedores/compras/agregar"
        label="REGISTRAR COMPRA"
      />

      <PurchaseFiltersForm />

      <GradientCard
        gradientId="purchases-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "420px" }}
      >
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Proveedor</div>
          <div className="text-gray-300 font-semibold">Fecha</div>
          <div className="text-gray-300 font-semibold">Descripción</div>
          <div className="text-gray-300 font-semibold">Total</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Compras</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {purchases.map((purchase) => (
            <PurchaseListCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      </GradientCard>

      <PurchasesPagination page={page} totalPages={totalPages} filters={filters} />
    </div>
  );
}
