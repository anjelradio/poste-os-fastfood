"use client";

import { useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { updateRawMaterialAction } from "../../actions/raw-material-actions";
import { UpdateRawMaterialRequestSchema } from "../../../data/schemas/raw-material-request.schema";

export default function EditRawMaterialForm({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: UpdateRawMaterialRequestSchema,
      payload: {
        name: formData.get("name"),
        stock: formData.get("stock"),
        minStock: formData.get("minStock"),
        measureUnit: formData.get("measureUnit"),
        category: formData.get("category"),
      },
      action: async (data) => updateRawMaterialAction(id, data),
      onSuccess: () => {
        showSuccessToast("Materia prima actualizada correctamente");
        router.push("/administracion/inventario/materias-primas");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard gradientId="edit-raw-material-form" title="Editar Materia Prima">
      <form action={handleSubmit} className="space-y-6">
        {children}

        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">Editar</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
