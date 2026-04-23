"use client";

import { useRouter } from "next/navigation";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import SearchSubmitButton from "@/features/shared/components/submit/SearchSubmitButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default function UserSearchForm() {
  const router = useRouter();

  const handleSearchForm = (formData: FormData) => {
    const username = (formData.get("username") as string | null) ?? "";
    const role = (formData.get("role") as string | null) ?? "";

    const params = new URLSearchParams();
    if (username) params.set("username", username);
    if (role) params.set("role", role);

    const query = params.toString();
    router.push(
      query
        ? `/administracion/usuarios/search?${query}`
        : "/administracion/usuarios/search",
    );
  };

  return (
    <GradientCard
      gradientId="users-filters-card"
      className="mb-6"
      contentClassName="p-6 rounded-2xl"
    >
      <form action={handleSearchForm}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <CustomFieldedFormText
              name="username"
              label="Nombre de Usuario"
              placeholder="Buscar por usuario..."
              className="text-white placeholder-gray-400"
            />
          </div>

          <div className="md:col-span-1">
            <CustomSelectForm name="role" label="Role" className="text-gray-400">
              <option value="" className="bg-gray-800">
                Filtrar por rol
              </option>
              <option value="ADMIN" className="bg-gray-800">
                Administración
              </option>
              <option value="CAJA" className="bg-gray-800">
                Caja
              </option>
              <option value="COCINA" className="bg-gray-800">
                Cocina
              </option>
            </CustomSelectForm>
          </div>

          <div className="md:col-span-1">
            <SearchSubmitButton pendingText="BUSCANDO...">
              BUSCAR USUARIOS
            </SearchSubmitButton>
          </div>
        </div>
      </form>
    </GradientCard>
  );
}
