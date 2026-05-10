"use client";

import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import SectionDivider from "@/features/shared/components/ui/SectionDivider";
import { useAppStore } from "@/lib/store/appStore";
import PurchaseAddItemForm from "./PurchaseAddItemForm";
import PurchaseItemCard from "./PurchaseItemCard";
import type { Purchase } from "@/features/purchases/domain/entities/purchase";

type PurchaseFormProps = {
  rawMaterials: RawMaterial[];
  initialPurchase?: Purchase;
};

export default function PurchaseForm({ rawMaterials, initialPurchase }: PurchaseFormProps) {
  const { purchaseItems, addPurchaseItem, removePurchaseItem } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelectForm
          name="supplierId"
          label="Proveedor"
          className="text-gray-400"
          defaultValue={initialPurchase?.supplierId ?? ""}
        >
          <option value="" className="bg-gray-800">Selecciona proveedor</option>
          <option value="1" className="bg-gray-800">Proveedor ID 1</option>
          <option value="4" className="bg-gray-800">Proveedor ID 2</option>
        </CustomSelectForm>

        <CustomFieldedFormText
          name="description"
          label="Descripción"
          defaultValue={initialPurchase?.description ?? ""}
          placeholder="Detalle de la compra"
          className="text-white"
        />
      </div>

      <div className="space-y-3">
        <div className="text-gray-300 text-sm font-semibold">Materias primas agregadas</div>
        {purchaseItems.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No hay materias primas agregadas</div>
        ) : (
          purchaseItems.map((item) => (
            <PurchaseItemCard
              key={item.rawMaterialId}
              item={item}
              onDelete={() => removePurchaseItem(item.rawMaterialId)}
            />
          ))
        )}
      </div>

      <SectionDivider label="AGREGAR MATERIA PRIMA" />

      <PurchaseAddItemForm rawMaterials={rawMaterials} onSubmit={addPurchaseItem} />
    </div>
  );
}
