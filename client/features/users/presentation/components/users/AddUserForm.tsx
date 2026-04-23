"use client";

import { useRouter } from "next/navigation";
import { CreateUserRequestSchema } from "@/features/users/data/schemas/create-user-request.schema";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { createUserAction } from "../../actions/user-actions";

export default function AddUserForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const data = {
      username: formData.get("username"),
      name: formData.get("name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      role: formData.get("role"),
      password: formData.get("password"),
    };

    const result = CreateUserRequestSchema.safeParse(data);
    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }

    const response = await createUserAction(result.data);

    if (response.ok) {
      showSuccessToast("Usuario registrado correctamente");
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
    <GradientFormCard gradientId="add-user-form" title="Registrar Usuario">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="REGISTRANDO...">
            REGISTRAR USUARIO
          </FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
