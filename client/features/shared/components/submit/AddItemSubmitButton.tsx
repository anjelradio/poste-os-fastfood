"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type AddItemSubmitButtonProps = ComponentProps<typeof Button>;

export default function AddItemSubmitButton({ className, ...props }: AddItemSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      {...props}
      type="submit"
      disabled={props.disabled || pending}
      className={cn(
        "w-full px-3 py-3 rounded-xl font-bold text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      <Plus className="h-5 w-5" />
    </Button>
  );
}
