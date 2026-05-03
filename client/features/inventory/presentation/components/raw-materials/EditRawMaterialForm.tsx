"use client";

import { useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function EditRawMaterialForm({ children }: any) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showSuccessToast("Materia prima actualizada correctamente");
    router.push("/administracion/inventario/materias-primas");
    router.refresh();
  };

  return (
    <GradientFormCard gradientId="edit-raw-material-form" title="Editar Materia Prima">
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">Editar</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
