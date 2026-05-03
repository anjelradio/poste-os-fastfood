"use client";

import { useRouter } from "next/navigation";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default function RawMaterialFiltersForm() {
  const router = useRouter();

  const handleSearch = (formData: FormData) => {
    const name = (formData.get("name") as string | null) ?? "";
    const category = (formData.get("category") as string | null) ?? "";

    const params = new URLSearchParams();

    if (name) {
      params.set("name", name);
    }

    if (category) {
      params.set("category", category);
    }

    const query = params.toString();
    router.push(
      query
        ? `/administracion/inventario/materias-primas?${query}`
        : "/administracion/inventario/materias-primas",
    );
  };

  return (
    <GradientCard
      gradientId="raw-materials-filters"
      className="mb-6"
      contentClassName="p-6 rounded-2xl"
    >
      <form action={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <CustomFieldedFormText
              name="name"
              label="Materia prima"
              placeholder="Buscar materia prima..."
              className="text-white placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-1">
            <CustomSelectForm name="category" label="Categoría" className="text-gray-400">
              <option value="" className="bg-gray-800">
                Filtrar por categoría
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

          <div className="md:col-span-1">
            <SearchSubmitButton pendingText="BUSCANDO...">
              BUSCAR MATERIAS PRIMAS
            </SearchSubmitButton>
          </div>
        </div>
      </form>
    </GradientCard>
  );
}
