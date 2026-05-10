"use client";

import { useParams, useRouter } from "next/navigation";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { UpdateUserRequestSchema } from "@/features/users/data/schemas/create-user-request.schema";
import { updateUserAction } from "../../actions/user-actions";

export default function EditUserForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = +params.id!;

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: UpdateUserRequestSchema,
      payload: {
        username: formData.get("username"),
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
      },
      action: async (data) => updateUserAction(id, data),
      onSuccess: () => {
        showSuccessToast("Usuario actualizado correctamente");
        router.push("/administracion/usuarios");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard gradientId="edit-user-form" title="Editar Usuario">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="GUARDANDO...">GUARDAR CAMBIOS</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
