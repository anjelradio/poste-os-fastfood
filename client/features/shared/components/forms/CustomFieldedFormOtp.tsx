"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

type CustomFieldedFormOtpProps = {
  name: string;
  label: string;
  maxLength?: number;
  className?: string;
};

export default function CustomFieldedFormOtp({
  name,
  label,
  maxLength = 6,
  className,
}: CustomFieldedFormOtpProps) {
  const firstGroupLength = Math.floor(maxLength / 2);
  const secondGroupLength = maxLength - firstGroupLength;

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <InputOTP
        id={name}
        name={name}
        maxLength={maxLength}
        pattern="^[0-9]+$"
        containerClassName={cn("justify-center", className)}
      >
        <InputOTPGroup>
          {Array.from({ length: firstGroupLength }, (_, index) => (
            <InputOTPSlot
              key={`${name}-first-${index}`}
              index={index}
              className="size-11 border-gray-600/50 bg-gray-800/60 text-base text-white"
            />
          ))}
        </InputOTPGroup>

        <InputOTPSeparator />

        <InputOTPGroup>
          {Array.from({ length: secondGroupLength }, (_, index) => (
            <InputOTPSlot
              key={`${name}-second-${index}`}
              index={firstGroupLength + index}
              className="size-11 border-gray-600/50 bg-gray-800/60 text-base text-white"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
