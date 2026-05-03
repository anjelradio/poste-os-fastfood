"use client";

import { useEffect, useState } from "react";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";
import type { MeasureUnit } from "@/features/inventory/domain/entities/measure-unit";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import AddItemSubmitButton from "@/features/shared/components/submit/AddItemSubmitButton";
import { handleApiErrors } from "@/lib/api/errors";

export default function RecipeAddIngredientForm({
  onSubmit,
  productId,
}: any) {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [measureUnits, setMeasureUnits] = useState<MeasureUnit[]>([]);

  useEffect(() => {
    const loadInventoryData = async () => {
      const [rawMaterialsResponse, measureUnitsResponse] = await Promise.all([
        inventoryRepository.getRawMaterials(),
        inventoryRepository.getMeasureUnits(),
      ]);

      if (!rawMaterialsResponse.ok) {
        handleApiErrors(rawMaterialsResponse.errors);
      } else {
        setRawMaterials(rawMaterialsResponse.data);
      }

      if (!measureUnitsResponse.ok) {
        handleApiErrors(measureUnitsResponse.errors);
      } else {
        setMeasureUnits(measureUnitsResponse.data);
      }
    };

    loadInventoryData();
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
