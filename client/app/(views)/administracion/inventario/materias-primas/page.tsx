
import CustomLinkButton from "@/features/shared/components/ui/CustomLinkButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import RawMaterialFiltersForm from "@/features/inventory/presentation/components/raw-materials/RawMaterialFiltersForm";
import RawMaterialListCard from "@/features/inventory/presentation/components/raw-materials/RawMaterialListCard";

export default function RawMaterailPage() {
  return (
    <div className="flex-1 pb-10">
      <ReturnHeading
        titlePage="Gestión de Materias Primas"
        backHref="/administracion/inventario"
      />

      <CustomLinkButton
        pageUrl="/administracion/inventario/materias-primas/agregar"
        label="REGISTRAR MATERIA PRIMA"
      />

      <RawMaterialFiltersForm />

      <GradientCard
        gradientId="raw-materials-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "420px" }}
      >
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">Categoría</div>
          <div className="text-gray-300 font-semibold">Stock actual</div>
          <div className="text-gray-300 font-semibold">Stock mínimo</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Materias primas</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          <RawMaterialListCard />
          <RawMaterialListCard />
          <RawMaterialListCard />
        </div>
      </GradientCard>
    </div>
  );
}
