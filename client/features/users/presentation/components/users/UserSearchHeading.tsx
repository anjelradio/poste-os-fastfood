"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type UserSearchHeadingProps = {
  username?: string;
  role?: string;
};

function getRoleLabel(role: string) {
  switch (role) {
    case "ADMIN":
      return "Administración";
    case "CAJA":
      return "Caja";
    case "COCINA":
      return "Cocina";
    default:
      return role;
  }
}

export default function UserSearchHeading({ username, role }: UserSearchHeadingProps) {
  const router = useRouter();

  const activeFilters = [
    username ? { label: "Usuario", value: username } : null,
    role ? { label: "Role", value: getRoleLabel(role) } : null,
  ].filter((filter) => filter !== null);

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.back()}
        className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-orange-400 font-bold text-lg">Resultados de la busqueda</span>

        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter.label}
                className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-medium text-sm"
              >
                {filter.label}: {filter.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
