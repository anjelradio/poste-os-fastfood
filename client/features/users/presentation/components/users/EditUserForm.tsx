"use client";

import { useParams, useRouter } from "next/navigation";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
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
    const data = {
      username: formData.get("username"),
      name: formData.get("name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    };

    const result = UpdateUserRequestSchema.safeParse(data);
    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }

    const response = await updateUserAction(id, result.data);

    if (response.ok) {
      showSuccessToast("Usuario actualizado correctamente");
      router.push("/administracion/usuarios");
      router.refresh();
      return;
    }

    if (response.validationErrors) {
      handleValidationErrors(response.validationErrors);
      return;
    }

    handleApiErrors(response.errors);
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
