import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import EditSupplierForm from "@/features/purchases/presentation/components/suppliers/EditSupplierForm";
import SupplierForm from "@/features/purchases/presentation/components/suppliers/SupplierForm";

export default async function EditSupplierPage({ params }: any) {
  const resolvedParams = await params;

  const supplier = {
    id: resolvedParams.id,
    businessName: "DISTRIBUIDORA LOS ANDES S.R.L.",
    contactName: "Juan Perez",
    phone: "+591 71234567",
    email: "compras@losandes.com",
  };

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
