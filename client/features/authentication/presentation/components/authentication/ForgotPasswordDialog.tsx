"use client";

import { useState } from "react";
import {
  ForgotPasswordRequestSchema,
  ForgotPasswordVerifyOtpSchema,
} from "@/features/authentication/data/schemas/auth.schema";
import {
  requestForgotPasswordOtpAction,
  verifyForgotPasswordOtpAction,
} from "@/features/authentication/presentation/actions/authentication/forgot-password-actions";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import CustomFieldedFormOtp from "@/features/shared/components/forms/CustomFieldedFormOtp";
import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

type ForgotPasswordStep = "request" | "verify";

export default function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [email, setEmail] = useState("");

  const resetDialogState = () => {
    setStep("request");
    setEmail("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetDialogState();
    }
  };

  const handleRequestOtp = async (formData: FormData) => {
    const emailInput = String(formData.get("email") ?? "").trim();

    await submitWithSchema({
      schema: ForgotPasswordRequestSchema,
      payload: {
        email: emailInput,
      },
      action: requestForgotPasswordOtpAction,
      onSuccess: ({ data }) => {
        if (!data) {
          return;
        }

        setEmail(emailInput);
        setStep("verify");
        showSuccessToast(data.message);
      },
    });
  };

  const handleVerifyOtp = async (formData: FormData) => {
    await submitWithSchema({
      schema: ForgotPasswordVerifyOtpSchema,
      payload: {
        email,
        otp: String(formData.get("otp") ?? "").trim(),
      },
      action: verifyForgotPasswordOtpAction,
      onSuccess: ({ data }) => {
        if (!data) {
          return;
        }

        showSuccessToast(data.message);
        handleOpenChange(false);
      },
    });
  };

  const title =
    step === "request" ? "Recuperar contraseña" : "Verificar código OTP";
  const subtitle =
    step === "request"
      ? "Ingresa tu correo y te enviaremos un código OTP para recuperar tu contraseña."
      : `Te enviamos un código de 6 dígitos a ${email}. Ingrésalo para restablecer tu contraseña.`;

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="text-sm text-orange-400 transition-colors hover:text-orange-300"
      >
        ¿Olvidaste tu contraseña?
      </button>

      <AppDialogModal
        open={open}
        onOpenChange={handleOpenChange}
        size="md"
        title={title}
        subtitle={subtitle}
      >
        {step === "request" ? (
          <form action={handleRequestOtp} className="space-y-6">
            <CustomFieldedFormText
              type="email"
              name="email"
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
            />

            <FormSubmitButton pendingText="ENVIANDO...">
              ENVIAR CODIGO OTP
            </FormSubmitButton>
          </form>
        ) : (
          <form action={handleVerifyOtp} className="space-y-6">
            <CustomFieldedFormOtp
              name="otp"
              label="Código OTP"
            />

            <div className="space-y-3">
              <FormSubmitButton pendingText="VERIFICANDO...">
                VERIFICAR CODIGO
              </FormSubmitButton>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full rounded-xl border border-gray-600/70 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:border-orange-500/60 hover:text-orange-300"
              >
                Cambiar correo
              </button>
            </div>
          </form>
        )}
      </AppDialogModal>
    </>
  );
}
