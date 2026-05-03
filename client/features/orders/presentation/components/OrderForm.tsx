"use client";

import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import CustomFieldedFormTime from "@/features/shared/components/forms/CustomFieldedFormTime";
import OrderTypeOptions from "./OrderTypeOptions";
import DeliveryDetailsFields from "./DeliveryDetailsFields";
import { useAppStore } from "@/lib/store/appStore";

type OrderFormValues = {
  clientName?: string;
  reservedAt?: string;
  clientPhone?: string;
  address?: string;
  referenceNote?: string;
};

export default function OrderForm({ values }: { values?: OrderFormValues }) {
  const { orderType } = useAppStore();

  return (
    <>
      <CustomFieldedFormText
        name="clientName"
        label="Nombre del cliente"
        defaultValue={values?.clientName}
        placeholder="Nombre del cliente"
      />

      <CustomFieldedFormTime
        name="reservedAt"
        defaultValue={values?.reservedAt}
        label="Hora de reserva (Opcional)"
      />

      <OrderTypeOptions />
      {orderType === "DELIVERY" && <DeliveryDetailsFields values={values} />}
    </>
  );
}
