"use client";

import { Banknote, CreditCard, QrCode } from "lucide-react";
import OrderTypeOptionButton from "./OrderTypeOptionButton";
import { PaymentType } from "../../domain/entities/order";

type PaymentTypeOptionsProps = {
  paymentType: PaymentType | null;
  setPaymentType: (type: PaymentType) => void;
};

export default function PaymentTypeOptions({
  paymentType,
  setPaymentType,
}: PaymentTypeOptionsProps) {
  return (
    <div className="mb-3 shrink-0">
      <label className="text-gray-300 text-sm font-medium mb-2 block">
        Tipo de Pago:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <OrderTypeOptionButton
          label="Efectivo"
          isSelected={paymentType === PaymentType.CASH}
          onClick={() => setPaymentType(PaymentType.CASH)}
          icon={
            <Banknote
              className={`h-6 w-6 transition-colors duration-300 ${
                paymentType === PaymentType.CASH
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
        <OrderTypeOptionButton
          label="QR"
          isSelected={paymentType === PaymentType.QR}
          onClick={() => setPaymentType(PaymentType.QR)}
          icon={
            <QrCode
              className={`h-6 w-6 transition-colors duration-300 ${
                paymentType === PaymentType.QR
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
        <OrderTypeOptionButton
          label="Tarjeta"
          isSelected={paymentType === PaymentType.CARD}
          onClick={() => setPaymentType(PaymentType.CARD)}
          icon={
            <CreditCard
              className={`h-6 w-6 transition-colors duration-300 ${
                paymentType === PaymentType.CARD
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
      </div>
      {/* Hidden input to pass the value in FormData */}
      <input type="hidden" name="paymentType" value={paymentType || ""} />
    </div>
  );
}
