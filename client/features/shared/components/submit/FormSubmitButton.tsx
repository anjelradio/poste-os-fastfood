"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
type FormSubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
};
export default function FormSubmitButton({
  children,
  disabled,
  className,
  pendingText = "Procesando...",
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      disabled={disabled || pending}
      className={cn(
        "relative w-full h-full overflow-hidden rounded-xl bg-linear-to-r from-yellow-400 via-orange-500 to-orange-600 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,146,60,0.7)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
