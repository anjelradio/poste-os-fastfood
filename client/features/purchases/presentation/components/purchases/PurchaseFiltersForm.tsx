"use client";

import { useRouter } from "next/navigation";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import CustomFieldedFormDate from "@/features/shared/components/forms/CustomFieldedFormDate";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";
import { toPurchasesSearchQuery } from "@/features/purchases/data/mappers/purchase.mapper";

export default function PurchaseFiltersForm() {
  const router = useRouter();

  const handleSearchForm = (formData: FormData) => {
    const date = (formData.get("date") as string | null) ?? "";
    const params = toPurchasesSearchQuery({ date });
    const query = params.toString();

    router.push(
      query
        ? `/administracion/compras-y-proveedores/compras?${query}`
        : "/administracion/compras-y-proveedores/compras",
    );
  };

  return (
    <GradientCard
      gradientId="purchases-filters-card"
      className="mb-6"
      contentClassName="p-6 rounded-2xl"
    >
      <form action={handleSearchForm}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <CustomFieldedFormDate name="date" label="Fecha" className="text-gray-300" />
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
