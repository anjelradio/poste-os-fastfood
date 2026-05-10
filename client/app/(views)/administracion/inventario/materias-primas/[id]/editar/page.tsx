import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditRawMaterialForm from "@/features/inventory/presentation/components/raw-materials/EditRawMaterialForm";
import RawMaterialForm from "@/features/inventory/presentation/components/raw-materials/RawMaterialForm";
import { getRawMaterialByIdAction } from "@/features/inventory/presentation/actions/raw-material-actions";

export default async function EditRawMaterialPage({ params }: any) {
  const resolvedParams = await params;
  const rawMaterialId = Number(resolvedParams.id);

  const response = await getRawMaterialByIdAction(rawMaterialId);
  if (!response.ok || !response.data) {
    throw new Error(
      response.ok ? "Materia prima no encontrada" : response.errors[0],
    );
  }

  const rawMaterial = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Materias Primas"
        child={`Editar ${rawMaterial.name}`}
        backHref="/administracion/inventario/materias-primas"
      />
      <EditRawMaterialForm id={rawMaterialId}>
        <RawMaterialForm rawMaterial={rawMaterial} />
      </EditRawMaterialForm>
    </div>
  );
}
