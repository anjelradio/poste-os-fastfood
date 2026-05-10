"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const modalSizeClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-4xl",
} as const;

type AppDialogModalSize = keyof typeof modalSizeClass;

type AppDialogModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: AppDialogModalSize;
};

export default function AppDialogModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  size = "md",
}: AppDialogModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          modalSizeClass[size],
          "border-none bg-transparent p-4 shadow-none ring-0",
        )}
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-30 blur-2xl" />

          <div className="relative rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 p-[1.5px] shadow-[0_18px_46px_rgba(0,0,0,0.65)]">
            <div className="rounded-[15px] bg-black/80 p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center">
                <DialogTitle className="mb-2 text-2xl font-bold text-white text-center">
                  {title}
                </DialogTitle>
                {subtitle ? (
                  <DialogDescription className="text-base text-gray-300 text-center">
                    {subtitle}
                  </DialogDescription>
                ) : null}
              </div>

              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
