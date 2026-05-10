"use client";

import { Plus } from "lucide-react";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import { showErrorToast } from "@/features/shared/components/toast/ToastNotifications";
import { Button } from "@/components/ui/button";

type AddPurchaseItemPayload = {
  rawMaterialId: number;
  rawMaterialName: string;
  measureUnitName: string;
  quantity: number;
  unitPrice: number;
};

export default function PurchaseAddItemForm({
  rawMaterials,
  onSubmit,
}: {
  rawMaterials: RawMaterial[];
  onSubmit: (payload: AddPurchaseItemPayload) => void;
}) {
  const handleSubmit = (formData: FormData) => {
    const rawMaterialId = Number(formData.get("rawMaterial") || 0);
    const quantity = Number(formData.get("quantity") || 0);
    const unitPrice = Number(formData.get("unitPrice") || 0);
    const rawMaterial = rawMaterials.find((item) => item.id === rawMaterialId);

    if (!rawMaterialId || !rawMaterial) {
      showErrorToast("Selecciona una materia prima");
      return;
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      showErrorToast("La cantidad debe ser mayor a 0");
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      showErrorToast("El precio unitario debe ser mayor a 0");
      return;
    }

    onSubmit({
      rawMaterialId,
      rawMaterialName: rawMaterial.name,
      measureUnitName: rawMaterial.measureUnit.name,
      quantity,
      unitPrice,
    });
  };

  return (
    <div className="purchase-add-item space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5">
          <CustomSelectForm name="rawMaterial" label="Materia prima" className="text-gray-400">
            <option value="" className="bg-gray-800">Selecciona materia prima</option>
            {rawMaterials.map((rawMaterial) => (
              <option key={rawMaterial.id} value={rawMaterial.id} className="bg-gray-800">
                {rawMaterial.name} ({rawMaterial.measureUnit.name})
              </option>
            ))}
          </CustomSelectForm>
        </div>

        <div className="md:col-span-3">
          <CustomFieldedFormText
            name="quantity"
            label="Cantidad"
            type="number"
            placeholder="0"
            className="text-white"
          />
        </div>

        <div className="md:col-span-3">
          <CustomFieldedFormText
            name="unitPrice"
            label="Precio unitario"
            type="number"
            placeholder="0"
            className="text-white"
          />
        </div>

        <div className="md:col-span-1 flex items-end">
          <Button
            type="button"
            onClick={(e) => {
              const container = e.currentTarget.closest(".purchase-add-item");
              if (!container) return;
              const rawMaterial = container.querySelector(
                "select[name='rawMaterial']",
              ) as HTMLSelectElement | null;
              const quantity = container.querySelector(
                "input[name='quantity']",
              ) as HTMLInputElement | null;
              const unitPrice = container.querySelector(
                "input[name='unitPrice']",
              ) as HTMLInputElement | null;

              const formData = new FormData();
              formData.set("rawMaterial", rawMaterial?.value ?? "");
              formData.set("quantity", quantity?.value ?? "");
              formData.set("unitPrice", unitPrice?.value ?? "");

              handleSubmit(formData);

              if (rawMaterial) rawMaterial.value = "";
              if (quantity) quantity.value = "";
              if (unitPrice) unitPrice.value = "";
            }}
            className="h-[50px] w-full px-3 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105 flex items-center justify-center"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
