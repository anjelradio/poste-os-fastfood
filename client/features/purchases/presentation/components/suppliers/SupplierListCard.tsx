"use client";

import { Edit2 } from "lucide-react";
import Link from "next/link";
import DeleteSupplier from "./DeleteSupplier";
import type { Supplier } from "@/features/purchases/domain/entities/supplier";

type SupplierListCardProps = {
  supplier: Supplier;
};

export default function SupplierListCard({ supplier }: SupplierListCardProps) {
  return (
    <>
      <div
        className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">{supplier.businessName}</div>
        <div className="text-gray-200">{supplier.contactName}</div>
        <div className="text-gray-200">{supplier.phone}</div>
        <div className="text-gray-200">{supplier.email}</div>
        <div className="flex items-center gap-3">
          <Link
            href={`/administracion/compras-y-proveedores/proveedores/${supplier.id}/editar`}
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <DeleteSupplier
            supplier={supplier}
            className="text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
          />
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">{supplier.businessName}</div>
          <div className="text-gray-400 text-sm">Contacto: {supplier.contactName}</div>
          <div className="text-gray-400 text-sm">Teléfono: {supplier.phone}</div>
          <div className="text-orange-400 text-sm">Correo: {supplier.email}</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href={`/administracion/compras-y-proveedores/proveedores/${supplier.id}/editar`}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Editar</span>
            </Link>

            <DeleteSupplier
              supplier={supplier}
              showLabel
              className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-colors duration-200 hover:bg-red-500/20 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
