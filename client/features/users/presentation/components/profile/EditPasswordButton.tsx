"use client";

import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { ChangePasswordRequestSchema } from "@/features/users/data/schemas/change-password-request.schema";
import { changePasswordAction } from "@/features/users/presentation/actions/profile-actions";
import { useState } from "react";

export default function EditPasswordButton() {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: ChangePasswordRequestSchema,
      payload: {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      },
      action: changePasswordAction,
      onSuccess: () => {
        showSuccessToast("Contraseña actualizada correctamente");
        setOpen(false);
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-8 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105 whitespace-nowrap"
      >
        Cambiar Contraseña
      </button>

      <AppDialogModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Cambiar Contraseña"
        subtitle="Ingresa tu contraseña actual y define una nueva contraseña segura."
      >
        <form action={handleSubmit} className="space-y-5">
          <CustomFieldedFormText
            type="password"
            name="currentPassword"
            label="Contraseña Actual"
            placeholder="Contraseña actual"
          />

          <CustomFieldedFormText
            type="password"
            name="newPassword"
            label="Nueva Contraseña"
            placeholder="Nueva contraseña"
          />

          <CustomFieldedFormText
            type="password"
            name="confirmPassword"
            label="Confirmar Nueva Contraseña"
            placeholder="Confirma la nueva contraseña"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent py-3 font-bold text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10"
            >
              Cancelar
            </button>

            <FormSubmitButton className="flex-1" pendingText="ACTUALIZANDO...">
              Actualizar Contraseña
            </FormSubmitButton>
          </div>
        </form>
      </AppDialogModal>
    </>
  );
}
