"use client";
import { useEffect, useState } from "react";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";
import { categoriesRepository } from "@/features/products/data/repositories/categories.repository";
import type { Category } from "@/features/products/domain/entities/category";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { CategoryType } from "@/lib/constants/category.constants";
import { handleApiErrors } from "@/lib/api/errors";
import { useRouter } from "next/navigation";

export default function ProductSearchForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await categoriesRepository.getCategories(CategoryType.PRODUCT);

      if (!response.ok) {
        handleApiErrors(response.errors);
        return;
      }

      setCategories(response.data);
    };

    loadCategories();
  }, []);

  const handleSearchForm = (formData: FormData) => {
    const productName = (formData.get("productName") as string | null) ?? "";
    const category = (formData.get("category") as string | null) ?? "";

    const params = new URLSearchParams();
    if (productName) params.set("productName", productName);
    if (category) params.set("category", category);
    const query = params.toString();
    router.push(
      query
        ? `/administracion/productos/search?${query}`
        : "/administracion/productos/search",
    );
  };

  return (
    <GradientCard
      gradientId="filters-card"
      className="mb-6"
      contentClassName="p-6 rounded-2xl"
    >
      <form action={handleSearchForm}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-1">
            <CustomFieldedFormText
              name="productName"
              label="Producto"
              placeholder="Buscar producto..."
              className="text-white placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-1">
            <CustomSelectForm
              name="category"
              label="Categoría"
              className="text-gray-400"
            >
              <option value="" className="bg-gray-800">
                Filtrar por categoría
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.slug}
                  className="bg-gray-800"
                >
                  {category.name}
                </option>
              ))}
            </CustomSelectForm>
          </div>

          {/* Apply Filters Button */}
          <div className="md:col-span-1">
            <SearchSubmitButton pendingText="BUSCANDO...">
              BUSCAR PRODUCTOS
            </SearchSubmitButton>
          </div>
        </div>
      </form>
    </GradientCard>
  );
}
