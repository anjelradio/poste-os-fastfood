"use client";

import { LoginFormSchema } from "@/features/authentication/data/schemas/auth.schema";
import ForgotPasswordDialog from "@/features/authentication/presentation/components/authentication/ForgotPasswordDialog";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { loginUser } from "../../actions/authentication/login-user-action";
import { useAppStore } from "@/lib/store/appStore";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: LoginFormSchema,
      payload: {
        username: formData.get("username"),
        password: formData.get("password"),
      },
      action: loginUser,
      onSuccess: ({ data }) => {
        if (!data) {
          return;
        }

        setUser(data.user);
        switch (data.user.role) {
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
      },
    });
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
