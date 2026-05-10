import { categoriesRepository } from "@/features/products/data/repositories/categories.repository";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";
import { CategoryType } from "@/lib/constants/category.constants";

type RawMaterialFormProps = {
  rawMaterial?: RawMaterial;
};

export default async function RawMaterialForm({ rawMaterial }: RawMaterialFormProps) {
  const [measureUnitsResponse, categoriesResponse] = await Promise.all([
    inventoryRepository.getMeasureUnits(),
    categoriesRepository.getCategories(CategoryType.RAW_MATERIAL),
  ]);

  if (!measureUnitsResponse.ok) {
    throw new Error(
      measureUnitsResponse.errors[0] ?? "Error al obtener las unidades de medida.",
    );
  }

  if (!categoriesResponse.ok) {
    throw new Error(categoriesResponse.errors[0] ?? "Error al obtener las categorias.");
  }

  const measureUnits = measureUnitsResponse.data;
  const categories = categoriesResponse.data;

  return (
    <div className="space-y-6">
      <CustomFieldedFormText
        name="name"
        label="Nombre"
        defaultValue={rawMaterial?.name}
        placeholder="Ej: Carne molida"
        className="text-white placeholder-gray-500"
      />

      <CustomFieldedFormText
        name="stock"
        label="Stock actual"
        type="number"
        defaultValue={rawMaterial?.stock}
        placeholder="0"
        className="text-white"
      />

      <CustomFieldedFormText
        name="minStock"
        label="Stock mínimo"
        type="number"
        defaultValue={rawMaterial?.minStock}
        placeholder="0"
        className="text-white"
      />

      <CustomSelectForm
        name="measureUnit"
        label="Unidad de medida"
        className="text-gray-400"
        defaultValue={rawMaterial?.measureUnit.id}
      >
        <option value="" className="bg-gray-800">
          Seleccionar unidad
        </option>
        {measureUnits.map((measureUnit) => (
          <option key={measureUnit.id} value={measureUnit.id} className="bg-gray-800">
            {measureUnit.name} ({measureUnit.code})
          </option>
        ))}
      </CustomSelectForm>

      <CustomSelectForm
        name="category"
        label="Categoría"
        className="text-gray-400"
        defaultValue={rawMaterial?.category.id}
      >
        <option value="" className="bg-gray-800">
          Seleccionar categoría
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id} className="bg-gray-800">
            {category.name}
          </option>
        ))}
      </CustomSelectForm>
    </div>
  );
}
