"use client";

import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { Lock } from "lucide-react";
import EditPasswordButton from "./EditPasswordButton";

export default function ProfileSecurityCard() {
  return (
    <GradientCard
      gradientId="profile-security-card"
      minHeight={120}
      contentClassName="p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Seguridad</h2>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-orange-500/20 border-2 border-orange-500/40">
            <Lock className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Contraseña</p>
            <p className="text-gray-400 text-sm">
              Puedes cambiar tu contraseña para mantener tu cuenta segura.
            </p>
          </div>
        </div>

        <EditPasswordButton />
      </div>
    </GradientCard>
  );
}
