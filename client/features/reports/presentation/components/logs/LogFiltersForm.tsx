"use client";

import { useRouter } from "next/navigation";
import CustomFieldedFormDate from "@/features/shared/components/forms/CustomFieldedFormDate";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { SearchLogsSchema } from "@/features/reports/data/schemas/logs/logs-search-form";
import { handleZodErrors } from "@/lib/api/errors";

export default function LogFiltersForm() {
  const router = useRouter();

  const handleSearchForm = (formData: FormData) => {
    const filters = {
      area: String(formData.get("area") ?? ""),
      date: String(formData.get("date") ?? ""),
    };

    const parsedData = SearchLogsSchema.safeParse(filters);
    if (!parsedData.success) {
      handleZodErrors(parsedData.error.issues);
      return;
    }

    const params = new URLSearchParams();
    if (parsedData.data.area) params.set("area", parsedData.data.area);
    if (parsedData.data.date) params.set("date", parsedData.data.date);

    const query = params.toString();

    router.push(
      query
        ? `/administracion/historial-y-reportes/bitacora/search?${query}`
        : "/administracion/historial-y-reportes/bitacora/",
    );
  };

  return (
    <GradientCard
      gradientId="logs-filters-card"
      className="mb-6"
      contentClassName="rounded-2xl p-6"
    >
      <form action={handleSearchForm}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <CustomSelectForm name="area" label="Sector" defaultValue="">
              <option value="" className="bg-gray-800">
                Todos los sectores
              </option>
              <option value="CAJA" className="bg-gray-800">
                Caja
              </option>
              <option value="COCINA" className="bg-gray-800">
                Cocina
              </option>
              <option value="ADMINISTRATION" className="bg-gray-800">
                Administracion
              </option>
            </CustomSelectForm>
          </div>

          <div className="md:col-span-1">
            <CustomFieldedFormDate name="date" label="Fecha" />
          </div>

          <div className="md:col-span-1">
            <SearchSubmitButton pendingText="APLICANDO...">
              APLICAR FILTROS
            </SearchSubmitButton>
          </div>
        </div>
      </form>
    </GradientCard>
  );
}
