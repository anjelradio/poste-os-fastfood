"use client";

import DeletePurchaseItem from "./DeletePurchaseItem";

export default function PurchaseItemCard({
  item,
  onDelete,
}: {
  item: {
    rawMaterialId: number;
    rawMaterialName: string;
    measureUnitName: string;
    quantity: number;
    unitPrice: number;
  };
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-600/30 hover:border-orange-500/30 transition-colors duration-200">
      <div className="flex-1">
        <div className="text-white font-semibold">{item.rawMaterialName}</div>
        <div className="text-gray-400 text-sm">
          {item.quantity} {item.measureUnitName} - Bs. {item.unitPrice}
        </div>
      </div>
      <DeletePurchaseItem
        item={item}
        onDelete={onDelete}
        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
      />
    </div>
  );
}
