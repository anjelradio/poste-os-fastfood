"use client";

import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import AlertModalButton from "../submit/AlertModalButton";

const modalSizeClass = {
  sm: "data-[size=default]:max-w-sm sm:data-[size=default]:max-w-sm",
  md: "data-[size=default]:max-w-md sm:data-[size=default]:max-w-md",
  lg: "data-[size=default]:max-w-xl sm:data-[size=default]:max-w-xl",
  xl: "data-[size=default]:max-w-2xl sm:data-[size=default]:max-w-2xl",
  full: "data-[size=default]:max-w-4xl sm:data-[size=default]:max-w-4xl",
} as const;

type AppAlertModalSize = keyof typeof modalSizeClass;

type AppAlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children?: ReactNode;
  onConfirm: () => Promise<boolean>;
  confirmText?: string;
  confirmPendingText?: string;
  icon?: ReactNode;
  size?: AppAlertModalSize;
};

export default function AppAlertModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmText = "Confirmar",
  confirmPendingText = "Procesando...",
  icon,
  size = "md",
}: AppAlertModalProps) {
  const handleConfirmAction = async () => {
    const shouldClose = await onConfirm();

    if (shouldClose) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          modalSizeClass[size],
          "border-none bg-transparent p-4 shadow-none ring-0",
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-30 blur-2xl" />

          <div className="relative rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 p-[1.5px] shadow-[0_18px_46px_rgba(0,0,0,0.65)]">
            <div className="rounded-[15px] bg-black/80 p-6 backdrop-blur-xl sm:p-8">
              <form action={handleConfirmAction}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_18px_rgba(239,68,68,0.45)]">
                    {icon ?? <AlertTriangle className="h-6 w-6 text-amber-100" />}
                  </div>

                  <AlertDialogTitle className="text-2xl font-bold text-white">
                    {title}
                  </AlertDialogTitle>
                </div>

                <AlertDialogDescription className="mb-4 text-base text-gray-300">
                  {description}
                </AlertDialogDescription>

                {children ? <div className="mb-8">{children}</div> : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AlertModalButton
                    type="submit"
                    variantStyle="confirm"
                    pendingText={confirmPendingText}
                  >
                    {confirmText}
                  </AlertModalButton>

                  <AlertModalButton
                    type="button"
                    variantStyle="cancel"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </AlertModalButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
