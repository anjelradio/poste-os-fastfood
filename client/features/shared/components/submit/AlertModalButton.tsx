"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type AlertModalButtonProps = ComponentProps<typeof Button> & {
  variantStyle?: "confirm" | "cancel";
  pendingText?: string;
};

export default function AlertModalButton({
  children,
  disabled,
  className,
  variantStyle = "confirm",
  pendingText = "Procesando...",
  ...props
}: AlertModalButtonProps) {
  const { pending } = useFormStatus();
  const isConfirmButton = variantStyle === "confirm";

  return (
    <Button
      {...props}
      disabled={disabled || pending}
      className={cn(
        "flex-1 rounded-xl py-3 font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        isConfirmButton
          ? "bg-gradient-to-r from-red-500 to-red-600 text-amber-100 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          : "border-2 border-gray-600 bg-transparent text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/10",
        className,
      )}
    >
      {isConfirmButton && pending ? pendingText : children}
    </Button>
  );
}
