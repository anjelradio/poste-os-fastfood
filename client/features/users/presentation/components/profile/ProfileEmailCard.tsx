"use client";

import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { useAppStore } from "@/lib/store/appStore";
import EditEmailButton from "./EditEmailButton";

export default function ProfileEmailCard() {
  const { user } = useAppStore();

  return (
    <GradientCard gradientId="profile-email-card" minHeight={120} contentClassName="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Correo Electrónico</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Correo Electronico
          </label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white cursor-not-allowed opacity-75"
          />
        </div>

        <EditEmailButton />
      </div>
    </GradientCard>
  );
}
