"use server";

import { inventoryRepository } from "../../data/repositories/inventory.repository";

export async function getRawMaterialsAction() {
  return inventoryRepository.getRawMaterials();
}

export async function getMeasureUnitsAction() {
  return inventoryRepository.getMeasureUnits();
}
