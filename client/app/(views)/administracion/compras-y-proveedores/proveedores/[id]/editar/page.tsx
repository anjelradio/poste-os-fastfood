import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditSupplierForm from "@/features/purchases/presentation/components/suppliers/EditSupplierForm";
import SupplierForm from "@/features/purchases/presentation/components/suppliers/SupplierForm";
import { getSupplierByIdAction } from "@/features/purchases/presentation/actions/supplier-actions";

type EditSupplierPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const resolvedParams = await params;
  const supplierId = Number(resolvedParams.id);

  const response = await getSupplierByIdAction(supplierId);
  if (!response.ok || !response.data) {
    throw new Error(response.ok ? "Proveedor no encontrado" : response.errors[0]);
  }

  const supplier = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Proveedores"
        child={`Editar ${supplier.businessName}`}
        backHref="/administracion/compras-y-proveedores/proveedores"
      />
      <EditSupplierForm id={supplierId}>
        <SupplierForm supplier={supplier} />
      </EditSupplierForm>
    </div>
  );
}
