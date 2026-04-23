"use client";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
type FormSubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
};
export default function SearchSubmitButton({
  children,
  disabled,
  pendingText = "Procesando...",
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className="cursor-pointer w-full h-full px-6 py-3 rounded-xl font-semibold text-sm text-white border-2 border-gray-600/50 hover:border-orange-500/50 transition-all duration-200 hover:bg-orange-500/10"
    >
      {pending ? pendingText : children}
    </Button>
  );
}
