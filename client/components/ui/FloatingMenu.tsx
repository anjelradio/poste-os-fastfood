"use client";

import { History, ShoppingBag } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@/features/authentication/domain/entities/user";

type FloatingMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: User["role"];
  trigger: React.ReactNode;
};

export function FloatingMenu({
  open,
  onOpenChange,
  role,
  trigger,
}: FloatingMenuProps) {
  const router = useRouter();
  const pathName = usePathname();

  const isCajaRole = role === "CAJA";
  const firstItemLabel = isCajaRole ? "Caja" : "Órdenes";
  const secondItemLabel = isCajaRole ? "Mis Órdenes" : "Recetas";
  const firstItemPath = isCajaRole ? "/caja/hamburguesas" : "/cocina";
  const secondItemPath = isCajaRole ? "/caja/ordenes" : "/cocina/recetas";

  const firstItemActive = pathName.startsWith(firstItemPath);
  const secondItemActive = pathName.startsWith(secondItemPath);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={20}
        className="z-50 w-[300px] rounded-2xl border-none bg-transparent p-0 shadow-none outline-none"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-30 blur-lg" />

          {/* Menu Container with gradient border */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background:
                "linear-gradient(rgba(20, 23, 28, 0.85), rgba(20, 23, 28, 0.85)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box",
              border: "3px solid transparent",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Caja */}
                <button
                  onClick={() => {
                    onOpenChange(false);
                    router.push(firstItemPath);
                  }}
                  className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 transition-all duration-300 hover:scale-105"
                  style={{
                    border: "2px solid transparent",
                    background:
                      firstItemActive
                        ? "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box"
                        : "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
                    boxShadow:
                      firstItemActive
                        ? "0 0 20px rgba(251, 146, 60, 0.4)"
                        : "none",
                  }}
                >
                  {firstItemActive && (
                    <div
                      className="absolute inset-0 -z-10 rounded-xl blur-md"
                      style={{
                        background:
                          "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: 0.3,
                      }}
                    />
                  )}

                  <div
                    className="absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: "0 0 25px rgba(251, 146, 60, 0.4)" }}
                  />

                  <ShoppingBag
                    className={`h-6 w-6 transition-colors duration-300 ${
                      firstItemActive
                        ? "text-orange-400"
                        : "text-gray-500 group-hover:text-orange-300"
                    }`}
                    strokeWidth={2}
                  />

                  <span
                    className={`text-xs font-bold transition-colors duration-300 ${
                      firstItemActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {firstItemLabel}
                  </span>
                </button>

                {/* Historial */}
                <button
                  onClick={() => {
                    onOpenChange(false);
                    router.push(secondItemPath);
                  }}
                  className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 transition-all duration-300 hover:scale-105"
                  style={{
                    border: "2px solid transparent",
                    background:
                      secondItemActive
                        ? "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box"
                        : "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
                    boxShadow:
                      secondItemActive
                        ? "0 0 20px rgba(251, 146, 60, 0.4)"
                        : "none",
                  }}
                >
                  {secondItemActive && (
                    <div
                      className="absolute inset-0 -z-10 rounded-xl blur-md"
                      style={{
                        background:
                          "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: 0.3,
                      }}
                    />
                  )}

                  <div
                    className="absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: "0 0 25px rgba(251, 146, 60, 0.4)" }}
                  />

                  <History
                    className={`h-6 w-6 transition-colors duration-300 ${
                      secondItemActive
                        ? "text-orange-400"
                        : "text-gray-500 group-hover:text-orange-300"
                    }`}
                    strokeWidth={2}
                  />

                  <span
                    className={`text-xs font-bold transition-colors duration-300 ${
                      secondItemActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {secondItemLabel}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
