
import CustomLinkButton from "@/features/shared/components/ui/CustomLinkButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import SupplierListCard from "@/features/purchases/presentation/components/suppliers/SupplierListCard";

export default function SuppliersPage() {
  return (
    <div className="flex-1 pb-10">
      <ReturnHeading
        titlePage="Gestión de Proveedores"
        backHref="/administracion/compras-y-proveedores"
      />

      <CustomLinkButton
        pageUrl="/administracion/compras-y-proveedores/proveedores/agregar"
        label="REGISTRAR PROVEEDOR"
      />

      <GradientCard
        gradientId="suppliers-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "420px" }}
      >
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Razón social</div>
          <div className="text-gray-300 font-semibold">Contacto</div>
          <div className="text-gray-300 font-semibold">Teléfono</div>
          <div className="text-gray-300 font-semibold">Correo</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Proveedores</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          <SupplierListCard />
          <SupplierListCard />
          <SupplierListCard />
        </div>
      </GradientCard>
    </div>
  );
}
