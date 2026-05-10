"use client";

import { useRouter } from "next/navigation";
import { CreateUserRequestSchema } from "@/features/users/data/schemas/create-user-request.schema";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
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
    await submitWithSchema({
      schema: CreateUserRequestSchema,
      payload: {
        username: formData.get("username"),
        name: formData.get("name"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        role: formData.get("role"),
        password: formData.get("password"),
      },
      action: createUserAction,
      onSuccess: () => {
        showSuccessToast("Usuario registrado correctamente");
        router.push("/administracion/usuarios");
        router.refresh();
      },
    });
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
