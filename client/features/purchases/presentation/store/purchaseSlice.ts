import { StateCreator } from "zustand";

export type PurchaseFormItem = {
  rawMaterialId: number;
  rawMaterialName: string;
  measureUnitName: string;
  quantity: number;
  unitPrice: number;
};

export interface PurchaseSlice {
  purchaseItems: PurchaseFormItem[];
  hydratePurchaseItems: (items: PurchaseFormItem[]) => void;
  addPurchaseItem: (item: PurchaseFormItem) => void;
  removePurchaseItem: (rawMaterialId: number) => void;
  clearPurchaseItems: () => void;
}

export const createPurchaseSlice: StateCreator<PurchaseSlice> = (set, get) => ({
  purchaseItems: [],
  hydratePurchaseItems: (items) => set(() => ({ purchaseItems: items })),
  addPurchaseItem: (item) => {
    const existing = get().purchaseItems.find(
      (current) => current.rawMaterialId === item.rawMaterialId,
    );

    if (existing) {
      set((state) => ({
        purchaseItems: state.purchaseItems.map((current) =>
          current.rawMaterialId === item.rawMaterialId
            ? {
                ...current,
                quantity: current.quantity + item.quantity,
                unitPrice: item.unitPrice,
              }
            : current,
        ),
      }));
      return;
    }

    set((state) => ({ purchaseItems: [...state.purchaseItems, item] }));
  },
  removePurchaseItem: (rawMaterialId) => {
    set((state) => ({
      purchaseItems: state.purchaseItems.filter(
        (item) => item.rawMaterialId !== rawMaterialId,
      ),
    }));
  },
  clearPurchaseItems: () => set(() => ({ purchaseItems: [] })),
});
