"use client";

import { Edit2 } from "lucide-react";
import Link from "next/link";
import DeleteRawMaterial from "./DeleteRawMaterial";

export default function RawMaterialListCard() {
  const rawMaterial = {
    id: 1,
    name: "CARNE MOLIDA",
    category: "CARNES",
    stock: "20 KG",
    minStock: "5 KG",
  };

  return (
    <>
      <div
        className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">{rawMaterial.name}</div>
        <div className="text-gray-200">{rawMaterial.category}</div>
        <div className="text-gray-200">{rawMaterial.stock}</div>
        <div className="text-gray-200">{rawMaterial.minStock}</div>
        <div className="flex items-center gap-3">
          <Link
            href="/administracion/inventario/materias-primas/1/editar"
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <DeleteRawMaterial
            rawMaterial={rawMaterial}
            className="text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
          />
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">{rawMaterial.name}</div>
          <div className="text-gray-400 text-sm">Categoría: {rawMaterial.category}</div>
          <div className="text-gray-400 text-sm">Stock actual: {rawMaterial.stock}</div>
          <div className="text-orange-400 font-bold text-sm">Stock mínimo: {rawMaterial.minStock}</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/administracion/inventario/materias-primas/1/editar"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Editar</span>
            </Link>

            <DeleteRawMaterial
              rawMaterial={rawMaterial}
              showLabel
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-colors duration-200 hover:bg-red-500/20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
