import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditRawMaterialForm from "@/features/inventory/presentation/components/raw-materials/EditRawMaterialForm";
import RawMaterialForm from "@/features/inventory/presentation/components/raw-materials/RawMaterialForm";

export default async function EditRawMaterialPage({ params }: any) {
  const resolvedParams = await params;

  const rawMaterial = {
    id: resolvedParams.id,
    name: "Carne molida",
    stock: "20",
    minStock: "5",
    measureUnit: "kg",
    category: "carnes",
  };

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Materias Primas"
        child={`Editar ${rawMaterial.name}`}
        backHref="/administracion/inventario/materias-primas"
      />
      <EditRawMaterialForm>
        <RawMaterialForm rawMaterial={rawMaterial} />
      </EditRawMaterialForm>
    </div>
  );
}
