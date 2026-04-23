"use client";

import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import CustomFieldedFormOtp from "@/features/shared/components/forms/CustomFieldedFormOtp";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import {
  confirmChangeEmailAction,
  requestChangeEmailOtpAction,
  verifyChangeEmailOtpAction,
} from "@/features/users/presentation/actions/profile-actions";
import {
  ChangeEmailConfirmRequestSchema,
  ChangeEmailVerifyOtpRequestSchema,
} from "@/features/users/data/schemas/change-email-request.schema";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { useAppStore } from "@/lib/store/appStore";

type ChangeEmailStep = "confirm" | "otp" | "new-email";

export default function EditEmailButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ChangeEmailStep>("confirm");
  const [verificationToken, setVerificationToken] = useState("");
  const { user, setUser } = useAppStore();

  const resetState = () => {
    setStep("confirm");
    setVerificationToken("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetState();
    }
  };

  const handleRequestOtp = async () => {
    const response = await requestChangeEmailOtpAction();

    if (!response.ok) {
      handleApiErrors(response.errors);
      return;
    }

    showSuccessToast(response.data.message);
    setStep("otp");
  };

  const handleVerifyOtp = async (formData: FormData) => {
    const data = {
      otp: formData.get("otp"),
    };

    const parsedData = ChangeEmailVerifyOtpRequestSchema.safeParse(data);
    if (!parsedData.success) {
      handleZodErrors(parsedData.error.issues);
      return;
    }

    const response = await verifyChangeEmailOtpAction(parsedData.data);

    if (!response.ok) {
      if (response.validationErrors) {
        handleValidationErrors(response.validationErrors);
        return;
      }

      handleApiErrors(response.errors);
      return;
    }

    setVerificationToken(response.data.verification_token);
    showSuccessToast(response.data.message);
    setStep("new-email");
  };

  const handleConfirmChangeEmail = async (formData: FormData) => {
    const data = {
      verification_token: verificationToken,
      new_email: formData.get("new_email"),
    };

    const parsedData = ChangeEmailConfirmRequestSchema.safeParse(data);
    if (!parsedData.success) {
      handleZodErrors(parsedData.error.issues);
      return;
    }

    const response = await confirmChangeEmailAction(parsedData.data);

    if (!response.ok) {
      if (response.validationErrors) {
        handleValidationErrors(response.validationErrors);
        return;
      }

      handleApiErrors(response.errors);
      return;
    }

    setUser(response.data);
    showSuccessToast("Correo electrónico actualizado correctamente");
    handleOpenChange(false);
  };

  const subtitleByStep = {
    confirm:
      "Te enviaremos un código OTP a tu correo actual para validar el cambio.",
    otp: `Ingresa el código de 6 dígitos enviado a ${user?.email ?? "tu correo actual"}.`,
    "new-email": "Ingresa el nuevo correo electrónico que deseas usar en tu cuenta.",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="w-full px-6 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105"
      >
        Cambiar Correo Electrónico
      </button>

      <AppDialogModal
        open={open}
        onOpenChange={handleOpenChange}
        size="md"
        title="Cambiar Correo Electrónico"
        subtitle={subtitleByStep[step]}
      >
        {step === "confirm" ? (
          <form action={handleRequestOtp} className="space-y-6">
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-gray-300">
              Estás a punto de iniciar un cambio de correo electrónico. Por seguridad,
              primero verificaremos tu identidad con un código OTP enviado a tu correo
              actual.
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-700/60 bg-white/5 px-4 py-3">
              <Mail className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-200">{user?.email ?? "Sin correo"}</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent py-3 font-bold text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10"
              >
                Cancelar
              </button>

              <FormSubmitButton className="flex-1" pendingText="ENVIANDO OTP...">
                Confirmar
              </FormSubmitButton>
            </div>
          </form>
        ) : null}

        {step === "otp" ? (
          <form action={handleVerifyOtp} className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-gray-300">Verificación por OTP</span>
            </div>

            <CustomFieldedFormOtp
              name="otp"
              label="Código OTP"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep("confirm")}
                className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent py-3 font-bold text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10"
              >
                Volver
              </button>

              <FormSubmitButton className="flex-1" pendingText="VERIFICANDO...">
                Verificar Código
              </FormSubmitButton>
            </div>
          </form>
        ) : null}

        {step === "new-email" ? (
          <form action={handleConfirmChangeEmail} className="space-y-6">
            <CustomFieldedFormText
              type="email"
              name="new_email"
              label="Nuevo Correo Electrónico"
              placeholder="nuevo-correo@ejemplo.com"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="flex-1 rounded-xl border-2 border-gray-600 bg-transparent py-3 font-bold text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10"
              >
                Volver
              </button>

              <FormSubmitButton className="flex-1" pendingText="ACTUALIZANDO...">
                Confirmar Cambio
              </FormSubmitButton>
            </div>
          </form>
        ) : null}
      </AppDialogModal>
    </>
  );
}
