"use client";

import { useState } from "react";
import { User } from "lucide-react";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { updateProfileInfoAction } from "@/features/users/presentation/actions/profile-actions";
import { UpdateProfileInfoRequestSchema } from "@/features/users/data/schemas/update-profile-info-request.schema";
import { useAppStore } from "@/lib/store/appStore";

export default function EditProfileInfoButton() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useAppStore();

  const handleSubmit = async (formData: FormData) => {
    const data = {
      username: formData.get("username"),
      name: formData.get("name"),
      last_name: formData.get("last_name"),
    };

    const result = UpdateProfileInfoRequestSchema.safeParse(data);

    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }

    const response = await updateProfileInfoAction(result.data);

    if (!response.ok) {
      if (response.validationErrors) {
        handleValidationErrors(response.validationErrors);
        return;
      }

      handleApiErrors(response.errors);
      return;
    }

    setUser(response.data);
    showSuccessToast("Información actualizada correctamente");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-6 py-2.5 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105"
      >
        Editar Información Personal
      </button>

      <AppDialogModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Editar Información Personal"
        subtitle="Actualiza tus datos de perfil."
      >
        <form action={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
            <User className="h-5 w-5 text-orange-400" />
            <span className="text-sm text-gray-300">Perfil de usuario</span>
          </div>

          <CustomFieldedFormText
            name="username"
            label="Nombre de Usuario"
            defaultValue={user?.username}
          />

          <CustomFieldedFormText name="name" label="Nombres" defaultValue={user?.name} />

          <CustomFieldedFormText
            name="last_name"
            label="Apellidos"
            defaultValue={user?.last_name}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent py-3 font-bold text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10"
            >
              Cancelar
            </button>

            <FormSubmitButton className="flex-1" pendingText="GUARDANDO...">
              Guardar Cambios
            </FormSubmitButton>
          </div>
        </form>
      </AppDialogModal>
    </>
  );
}
