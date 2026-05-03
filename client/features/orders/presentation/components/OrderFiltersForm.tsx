"use client";

import { OrdersSearchSchema } from "@/lib/schemas/order.schema";
import { useRouter } from "next/navigation";
import {showErrorToast} from "@/features/shared/components/toast/ToastNotifications"
import { useAppStore } from "@/lib/store/appStore";
type OrderFiltersFormProps = {
  urlSearch: string;
};

export default function OrderFiltersForm({ urlSearch }: OrderFiltersFormProps) {
  const router = useRouter();
  const { user } = useAppStore();

  const handleSearchForm = (formData: FormData) => {
    const filters = {
      date: formData.get("date"),
      status: formData.get("status"),
      type: formData.get("type"),
    };
    console.log(filters)
    const result = OrdersSearchSchema.safeParse(filters);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        showErrorToast(issue.message);
      });
      return;
    }

    const params = new URLSearchParams();
    if (filters.date) params.set("date", String(filters.date));
    if (filters.status) params.set("status", String(filters.status));
    if (filters.type) params.set("type", String(filters.type));
    if (user?.id) params.set("user_id", String(user.id));
    router.push(`${urlSearch}/search?${params.toString()}`);
  };

  return (
    <form action={handleSearchForm}>
      <div className="relative group mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />

        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <linearGradient
                id="filtersBorderGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{
                    stopColor: "#fbbf24",
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="50%"
                  style={{
                    stopColor: "#f97316",
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: "#ea580c",
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx="16"
              ry="16"
              fill="none"
              stroke="url(#filtersBorderGradient)"
              strokeWidth="2"
            />
          </svg>

          <div
            className="relative rounded-2xl p-6"
            style={{ background: "transparent" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-300 focus:outline-none focus:border-orange-500/50 transition-colors duration-200"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="PREPARING">Preparando</option>
                  <option value="READY">Entregados</option>
                  <option value="CANCELLED">Cancelados</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Tipo de Orden
                </label>
                <select
                  name="type"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors duration-200 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="ALL">Todos los tipos</option>
                  <option value="LLEVAR">Para llevar</option>
                  <option value="MESA">Para mesa</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <input
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl font-semibold text-sm text-white border-2 border-gray-600/50 hover:border-orange-500/50 transition-all duration-200 hover:bg-orange-500/10 cursor-pointer"
                  value={"Aplicar Filtros"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
