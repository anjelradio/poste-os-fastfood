"use client";

import { LoginFormSchema } from "@/features/authentication/data/schemas/auth.schema";
import ForgotPasswordDialog from "@/features/authentication/presentation/components/authentication/ForgotPasswordDialog";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
import { loginUser } from "../../actions/authentication/login-user-action";
import { useAppStore } from "@/lib/store/appStore";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const result = LoginFormSchema.safeParse(data);
    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }

    const response = await loginUser(result.data);
    if (!response.ok) {
      if (response.validationErrors) {
        handleValidationErrors(response.validationErrors);
        return;
      }

      handleApiErrors(response.errors);
      return;
    }

    setUser(response.data.user);
    switch (response.data.user.role) {
      case "ADMIN":
        router.push("/administracion");
        break;
      case "CAJA":
        router.push("/caja/hamburguesas");
        break;
      case "COCINA":
        router.push("/cocina");
        break;
    }
  };
  return (
    <form action={handleSubmit} className="space-y-5">
      <CustomFieldedFormText
        name="username"
        type="text"
        label="Usuario"
        placeholder="Usuario"
        className="border-orange-500/50 bg-black/10 text-gray-300 placeholder-gray-500 focus:border-orange-400"
      />

      <CustomFieldedFormText
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Contraseña"
        className="border-orange-500/50 bg-black/10 text-gray-300 placeholder-gray-500 focus:border-orange-400"
      />

      <div className="text-right">
        <ForgotPasswordDialog />
      </div>

      <FormSubmitButton pendingText="INICIANDO SESION...">
        INICIAR SESION
      </FormSubmitButton>
    </form>
  );
}
