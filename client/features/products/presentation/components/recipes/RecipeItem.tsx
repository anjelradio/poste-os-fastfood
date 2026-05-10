"use client";

import DeleteRecipeItem from "./DeleteRecipeItem";

export default function RecipeItem({
  item,
  onDelete,
}: {
  item: {
    rawMaterialName: string;
    quantity: number;
    measureUnitName: string;
  };
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-600/30 hover:border-orange-500/30 transition-colors duration-200">
      <div className="flex-1">
        <div className="text-white font-semibold">{item.rawMaterialName}</div>
        <div className="text-gray-400 text-sm">
          {item.quantity} {item.measureUnitName}
        </div>
      </div>
      <DeleteRecipeItem
        item={item}
        onDelete={onDelete}
        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
      />
    </div>
  );
}
