"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type SearchHeadingProps = {
  labels: Record<string, string>;
  values: Record<string, string | undefined | null>;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-AR");
};

const getDisplayValue = (key: string, value: string | undefined | null) => {
  if (!value) return null;
  
  if (value === "ALL") return "Todos";
  if (key === "date") return formatDate(value);
  
  return value;
};

export default function SearchHeading({ labels, values }: SearchHeadingProps) {
  const router = useRouter();

  const activeFilters = Object.keys(labels).filter(
    (key) => values[key] && values[key] !== ""
  );

  if (activeFilters.length === 0) {
    return (
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>
        <span className="text-orange-400 font-bold text-lg">
          Resultados de la búsqueda
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.back()}
        className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-orange-400 font-bold text-lg">
          Resultados de la búsqueda:
        </span>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((key) => {
            const displayValue = getDisplayValue(key, values[key]);
            if (!displayValue) return null;
            
            return (
              <span
                key={key}
                className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-medium text-sm"
              >
                {labels[key]}: {displayValue}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
