import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import PurchaseForm from "@/features/purchases/presentation/components/purchases/PurchaseForm";
import CreatePurchaseForm from "@/features/purchases/presentation/components/purchases/CreatePurchaseForm";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";

export default async function AddPurchasePage() {
  const rawMaterialsResponse = await inventoryRepository.getRawMaterials();

  if (!rawMaterialsResponse.ok) {
    throw new Error(rawMaterialsResponse.errors[0] ?? "Error al obtener materias primas.");
  }

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Compras"
        child="Registrar compra"
        backHref="/administracion/compras-y-proveedores/compras"
      />
      <CreatePurchaseForm>
        <PurchaseForm rawMaterials={rawMaterialsResponse.data} />
      </CreatePurchaseForm>
    </div>
  );
}
