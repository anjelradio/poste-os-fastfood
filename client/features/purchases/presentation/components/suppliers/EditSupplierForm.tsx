"use client";

import { useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function EditSupplierForm({ children }: any) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSuccessToast("Proveedor actualizado correctamente");
    router.push("/administracion/compras-y-proveedores/proveedores");
    router.refresh();
  };

  return (
    <GradientFormCard gradientId="edit-supplier-form" title="Editar Proveedor">
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">Editar</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
