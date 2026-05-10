"use client";

import { useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { createSupplierAction } from "../../actions/supplier-actions";
import { CreateSupplierRequestSchema } from "../../../data/schemas/supplier-request.schema";

export default function AddSupplierForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: CreateSupplierRequestSchema,
      payload: {
        businessName: formData.get("businessName"),
        contactName: formData.get("contactName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
      },
      action: createSupplierAction,
      onSuccess: () => {
        showSuccessToast("Proveedor creado correctamente");
        router.push("/administracion/compras-y-proveedores/proveedores");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard gradientId="add-supplier-form" title="Registrar Proveedor">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">
            Registrar proveedor
          </FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
