import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";

export default function RawMaterialForm({ rawMaterial }: any) {
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
        defaultValue={rawMaterial?.measureUnit}
      >
        <option value="" className="bg-gray-800">
          Seleccionar unidad
        </option>
        <option value="kg" className="bg-gray-800">
          Kilogramo
        </option>
        <option value="g" className="bg-gray-800">
          Gramo
        </option>
        <option value="unit" className="bg-gray-800">
          Unidad
        </option>
      </CustomSelectForm>

      <CustomSelectForm
        name="category"
        label="Categoría"
        className="text-gray-400"
        defaultValue={rawMaterial?.category}
      >
        <option value="" className="bg-gray-800">
          Seleccionar categoría
        </option>
        <option value="carnes" className="bg-gray-800">
          Carnes
        </option>
        <option value="panaderia" className="bg-gray-800">
          Panadería
        </option>
        <option value="insumos" className="bg-gray-800">
          Insumos
        </option>
      </CustomSelectForm>
    </div>
  );
}
