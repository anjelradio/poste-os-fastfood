export const CategoryType = {
  PRODUCT: "PRODUCT",
  RAW_MATERIAL: "RAW_MATERIAL",
} as const;

export type CategoryTypeValue = (typeof CategoryType)[keyof typeof CategoryType];
