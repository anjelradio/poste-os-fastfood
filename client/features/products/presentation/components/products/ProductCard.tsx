"use client";

import type { Product } from "@/features/products/domain/entities/product";
import { useAppStore } from "@/lib/store";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToOrder } = useAppStore();

  return (
    <div className="relative group" onClick={() => addToOrder(product)}>
      <div className="absolute inset-0 rounded-xl bg-linear-to-b from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />

      <div
        className="relative rounded-xl border-2 border-transparent overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background:
            "padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
          border: "2px solid transparent",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/assets/background-products.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative p-3">
          {product.image && product.image !== "" ? (
            <Image
              src={product.image}
              alt={`Imagen de ${product.name}`}
              width={200}
              height={200}
              className="mb-2 aspect-square rounded-lg object-cover"
            />
          ) : (
            <div className="mb-2 aspect-square rounded-lg bg-[#1a1d23]/60 backdrop-blur-sm flex items-center justify-center border border-orange-500/20">
              <span className="text-gray-500 text-xs">Sin imagen</span>
            </div>
          )}

          <div className="space-y-1">
            <h3 className="font-medium text-white text-xs line-clamp-2">
              {product.name}
            </h3>
            <p className="text-orange-400 font-semibold text-sm">Bs. {product.price}</p>
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  );
}
