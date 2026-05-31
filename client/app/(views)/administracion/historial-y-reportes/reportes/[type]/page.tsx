import { notFound } from "next/navigation";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import { suppliersRepository } from "@/features/purchases/data/repositories/supplier.repository";
import type { Supplier } from "@/features/purchases/domain/entities/supplier";
import { productsRepository } from "@/features/products/data/repositories/products.repository";
import type { Product } from "@/features/products/domain/entities/product";
import ReportsTypeNavbar, {
  reportTypes,
  type ReportType,
} from "@/features/reports/presentation/components/reports/ReportsTypeNavbar";
import PurchasesReportForm from "@/features/reports/presentation/components/reports/PurchasesReportForm";
import ProfitsReportForm from "@/features/reports/presentation/components/reports/ProfitsReportForm";
import ProductSalesReportForm from "@/features/reports/presentation/components/reports/ProductSalesReportForm";

const reportTypeDescriptions: Record<ReportType, string> = {
  ganancias: "Configura filtros para generar el reporte de ganancias.",
  compras: "Configura filtros para generar el reporte de compras.",
  "ventas-producto": "Configura filtros para generar ventas por producto.",
};

const reportTypeTitles: Record<ReportType, string> = {
  ganancias: "Reporte de Ganancias",
  compras: "Reporte de Compras",
  "ventas-producto": "Reporte de Ventas por Producto",
};

function isReportType(value: string): value is ReportType {
  return reportTypes.some((type) => type.key === value);
}

export default async function ReportsByTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  if (!isReportType(type)) {
    notFound();
  }

  let rawMaterials: RawMaterial[] = [];
  let suppliers: Supplier[] = [];
  let products: Product[] = [];
  if (type === "compras") {
    const rawMaterialsResponse = await inventoryRepository.getRawMaterials();
    const suppliersResponse = await suppliersRepository.getSuppliers();

    if (!rawMaterialsResponse.ok) {
      throw new Error(rawMaterialsResponse.errors[0] ?? "Error al obtener materias primas.");
    }
    if (!suppliersResponse.ok) {
      throw new Error(suppliersResponse.errors[0] ?? "Error al obtener proveedores.");
    }

    rawMaterials = rawMaterialsResponse.data;
    suppliers = suppliersResponse.data;
  }

  if (type === "ventas-producto") {
    const productsResponse = await productsRepository.getProducts(1, 500);
    if (!productsResponse.ok) {
      throw new Error(productsResponse.errors[0] ?? "Error al obtener productos.");
    }
    products = productsResponse.data.products;
  }

  return (
    <div className="flex-1 pb-10">
      <ReturnHeading
        titlePage="Reportes del Negocio"
        backHref="/administracion/historial-y-reportes"
      />

      <ReportsTypeNavbar activeType={type} />

      {type === "compras" ? (
        <PurchasesReportForm rawMaterials={rawMaterials} suppliers={suppliers} />
      ) : type === "ganancias" ? (
        <ProfitsReportForm />
      ) : type === "ventas-producto" ? (
        <ProductSalesReportForm products={products} />
      ) : (
        <GradientCard
          gradientId={`report-content-${type}`}
          minHeight={260}
          contentClassName="rounded-2xl p-8"
        >
          <h2 className="text-white text-2xl font-bold mb-2">{reportTypeTitles[type]}</h2>
          <p className="text-gray-300 text-base">{reportTypeDescriptions[type]}</p>
        </GradientCard>
      )}
    </div>
  );
}
