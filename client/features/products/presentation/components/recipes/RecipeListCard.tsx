"use client";

import { Edit2 } from "lucide-react";
import Link from "next/link";
import DeleteRecipe from "./DeleteRecipe";

export default function RecipeListCard() {
  const recipe = {
    id: 1,
    name: "NOMBRE DEL PRODUCTO",
    category: "CATEGORÍA",
  };

  return (
    <>
      <div
        className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">NOMBRE DEL PRODUCTO</div>
        <div className="text-gray-200">CATEGORÍA</div>
        <div className="text-gray-200">00.00 Bs</div>
        <div className="flex items-center gap-3">
          <Link
            href="/cocina/recetas/1/editar"
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <DeleteRecipe
            recipe={recipe}
            className="text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
          />
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">NOMBRE DEL PRODUCTO</div>
          <div className="text-gray-400 text-sm">CATEGORÍA</div>
          <div className="text-orange-400 font-bold text-base">00.00 Bs</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/cocina/recetas/1/editar"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Editar</span>
            </Link>

            <DeleteRecipe
              recipe={recipe}
              showLabel
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-colors duration-200 hover:bg-red-500/20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
