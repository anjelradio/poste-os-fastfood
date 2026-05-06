import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditSupplierForm from "@/features/purchases/presentation/components/suppliers/EditSupplierForm";
import SupplierForm from "@/features/purchases/presentation/components/suppliers/SupplierForm";
import { getSupplierByIdAction } from "@/features/purchases/presentation/actions/supplier-actions";
import { notFound } from "next/navigation";

type EditSupplierPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const resolvedParams = await params;
  const supplierId = Number(resolvedParams.id);

  if (!Number.isInteger(supplierId)) {
    notFound();
  }

  const response = await getSupplierByIdAction(supplierId);

  if (!response.ok || !response.data) {
    notFound();
  }

  const supplier = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Proveedores"
        child={`Editar ${supplier.businessName}`}
        backHref="/administracion/compras-y-proveedores/proveedores"
      />
      <EditSupplierForm>
        <SupplierForm supplier={supplier} />
      </EditSupplierForm>
    </div>
  );
}
