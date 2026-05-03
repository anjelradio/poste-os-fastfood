import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import AddSupplierForm from "@/features/purchases/presentation/components/suppliers/AddSupplierForm";
import SupplierForm from "@/features/purchases/presentation/components/suppliers/SupplierForm";

export default function AddSupplierPage() {
  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Proveedores"
        child="Registrar Proveedor"
        backHref="/administracion/compras-y-proveedores/proveedores"
      />
      <AddSupplierForm>
        <SupplierForm />
      </AddSupplierForm>
    </div>
  );
}
