"use client"
import type { Product } from "@/features/products/domain/entities/product";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomCheckboxForm from "@/features/shared/components/forms/CustomCheckboxForm";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import ImageUpload from "./ImageUpload";
import { Category } from "@/features/products/domain/entities/category";

type ProductFormProps = {
  product?: Product;
  categories: Category[];
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  return (
    <>
      {/* Name and Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomFieldedFormText
          name="name"
          label="Nombre del Producto"
          defaultValue={product?.name}
          placeholder="Nombre del producto"
        />

        <CustomFieldedFormText
          type="number"
          name="price"
          label="Precio"
          defaultValue={product?.price}
          placeholder="Precio"
        />
      </div>

      {/* Category */}
      <CustomSelectForm
        name="category"
        label="Categoría"
        defaultValue={product?.category.id}
      >
        <option value="" className="bg-gray-800">
          Selecciona una categoría
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id} className="bg-gray-800">
            {category.name}
          </option>
        ))}
      </CustomSelectForm>

      <CustomCheckboxForm
        name="hasRecipe"
        label="Tiene receta"
        defaultChecked={product?.hasRecipe ?? true}
      />

      {/* Image Upload Slot */}
      <ImageUpload image={product?.image} />
    </>
  );
}
