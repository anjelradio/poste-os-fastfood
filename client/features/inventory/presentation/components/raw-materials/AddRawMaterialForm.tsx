"use client";

import { useRouter } from "next/navigation";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { createRawMaterialAction } from "../../actions/raw-material-actions";
import { CreateRawMaterialRequestSchema } from "../../../data/schemas/raw-material-request.schema";

export default function AddRawMaterialForm({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: CreateRawMaterialRequestSchema,
      payload: {
        name: formData.get("name"),
        stock: formData.get("stock"),
        minStock: formData.get("minStock"),
        measureUnit: formData.get("measureUnit"),
        category: formData.get("category"),
      },
      action: createRawMaterialAction,
      onSuccess: () => {
        showSuccessToast("Materia prima creada correctamente");
        router.push("/administracion/inventario/materias-primas");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard
      gradientId="add-raw-material-form"
      title="Registrar Materia Prima"
    >
      <form action={handleSubmit} className="space-y-6">
        {children}

        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">
            Registrar materia prima
          </FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
