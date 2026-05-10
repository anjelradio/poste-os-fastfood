import { notFound } from "next/navigation";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import PurchaseForm from "@/features/purchases/presentation/components/purchases/PurchaseForm";
import EditPurchaseForm from "@/features/purchases/presentation/components/purchases/EditPurchaseForm";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";
import { getPurchaseByIdAction } from "@/features/purchases/presentation/actions/purchase-actions";

export default async function EditPurchasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const purchaseId = Number(id);

  if (Number.isNaN(purchaseId) || purchaseId < 1) {
    notFound();
  }

  const [purchaseResponse, rawMaterialsResponse] = await Promise.all([
    getPurchaseByIdAction(purchaseId),
    inventoryRepository.getRawMaterials(),
  ]);

  if (!purchaseResponse.ok || !purchaseResponse.data) {
    notFound();
  }

  if (!rawMaterialsResponse.ok) {
    throw new Error(rawMaterialsResponse.errors[0] ?? "Error al obtener materias primas.");
  }

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Gestión de Compras"
        child={`Editar compra ${purchaseResponse.data.id}`}
        backHref="/administracion/compras-y-proveedores/compras"
      />
      <EditPurchaseForm purchase={purchaseResponse.data}>
        <PurchaseForm
          rawMaterials={rawMaterialsResponse.data}
          initialPurchase={purchaseResponse.data}
        />
      </EditPurchaseForm>
    </div>
  );
}
