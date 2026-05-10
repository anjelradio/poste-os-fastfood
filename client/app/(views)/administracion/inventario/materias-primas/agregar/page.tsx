import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import AddRawMaterialForm from "@/features/inventory/presentation/components/raw-materials/AddRawMaterialForm";
import RawMaterialForm from "@/features/inventory/presentation/components/raw-materials/RawMaterialForm";

export default function AddRawMaterialPage() {
  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Materias Primas"
        child="Registrar Materia Prima"
        backHref="/administracion/inventario/materias-primas"
      />
      <AddRawMaterialForm>
        <RawMaterialForm />
      </AddRawMaterialForm>
    </div>
  );
}
