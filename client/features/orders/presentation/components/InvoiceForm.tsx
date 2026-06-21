"use client";

import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import PaymentTypeOptions from "./PaymentTypeOptions";
import { PaymentType } from "../../domain/entities/order";
import { Info } from "lucide-react";

type InvoiceFormProps = {
  paymentType: PaymentType | null;
  setPaymentType: (type: PaymentType) => void;
};

export default function InvoiceForm({
  paymentType,
  setPaymentType,
}: InvoiceFormProps) {
  return (
    <div className="space-y-4">
      <CustomFieldedFormText
        name="nit"
        label="NIT del Cliente"
        placeholder="Ej: 123456789"
      />

      <PaymentTypeOptions
        paymentType={paymentType}
        setPaymentType={setPaymentType}
      />

      <div className="space-y-2">
        <CustomFieldedFormText
          type="email"
          name="email"
          label="Correo Electrónico (Opcional)"
          placeholder="Ej: cliente@email.com"
        />
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-900/20 border border-blue-500/30 text-blue-300 text-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Si proporcionas un correo, se enviará la factura automáticamente al cliente en formato PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
