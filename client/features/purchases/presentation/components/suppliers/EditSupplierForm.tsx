"use client";

import { useParams, useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { SupplierRequestSchema } from "@/features/purchases/data/schemas/supplier.schema";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { updateSupplierAction } from "../../actions/supplier-actions";

export default function EditSupplierForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: SupplierRequestSchema,
      payload: {
        businessName: formData.get("businessName"),
        contactName: formData.get("contactName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
      },
      action: async (data) => updateSupplierAction(id, data),
      onSuccess: () => {
        showSuccessToast("Proveedor actualizado correctamente");
        router.push("/administracion/compras-y-proveedores/proveedores");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard gradientId="edit-supplier-form" title="Editar Proveedor">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">Editar</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
