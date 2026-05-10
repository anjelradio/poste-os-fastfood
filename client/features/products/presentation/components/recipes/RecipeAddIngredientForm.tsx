"use client";

import type { MeasureUnit } from "@/features/inventory/domain/entities/measure-unit";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import AddItemSubmitButton from "@/features/shared/components/submit/AddItemSubmitButton";
import { showErrorToast } from "@/features/shared/components/toast/ToastNotifications";

type AddIngredientPayload = {
  rawMaterialId: number;
  rawMaterialName: string;
  measureUnitId: number;
  measureUnitName: string;
  quantity: number;
};

export default function RecipeAddIngredientForm({
  onSubmit,
  productId,
  rawMaterials,
  measureUnits,
}: {
  onSubmit: (payload: AddIngredientPayload) => void;
  productId: number;
  rawMaterials: RawMaterial[];
  measureUnits: MeasureUnit[];
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawMaterialId = Number(formData.get("rawMaterial") || 0);
    const measureUnitId = Number(formData.get("unit") || 0);
    const quantity = Number(formData.get("amount") || 0);

    const rawMaterial = rawMaterials.find((item) => item.id === rawMaterialId);
    const measureUnit = measureUnits.find((item) => item.id === measureUnitId);

    if (!rawMaterialId || !rawMaterial) {
      showErrorToast("Selecciona una materia prima");
      return;
    }

    if (!measureUnitId || !measureUnit) {
      showErrorToast("Selecciona una unidad");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      showErrorToast("La cantidad debe ser mayor a 0");
      return;
    }

    onSubmit({
      rawMaterialId,
      rawMaterialName: rawMaterial.name,
      measureUnitId,
      measureUnitName: measureUnit.name,
      quantity,
    });

    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5">
          <CustomSelectForm name="rawMaterial" label="Materia prima" className="text-gray-400">
            <option value="" className="bg-gray-800">
              Selecciona materia prima
            </option>
            {rawMaterials.map((rawMaterial) => (
              <option key={rawMaterial.id} value={rawMaterial.id} className="bg-gray-800">
                {rawMaterial.name}
              </option>
            ))}
          </CustomSelectForm>
        </div>

        <div className="md:col-span-3">
          <CustomFieldedFormText
            name="amount"
            label="Cantidad"
            type="number"
            placeholder="0"
            className="text-white"
          />
        </div>

        <div className="md:col-span-3">
          <CustomSelectForm name="unit" label="Unidad" className="text-gray-400">
            <option value="" className="bg-gray-800">
              Selecciona...
            </option>
            {measureUnits.map((measureUnit) => (
              <option key={measureUnit.id} value={measureUnit.id} className="bg-gray-800">
                {measureUnit.name}
              </option>
            ))}
          </CustomSelectForm>
        </div>

        <div className="md:col-span-1 flex items-end">
          <AddItemSubmitButton className="h-[50px]" />
        </div>
      </div>
    </form>
  );
}
