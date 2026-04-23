"use client";

import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { useAppStore } from "@/lib/store/appStore";
import EditProfileInfoButton from "./EditProfileInfoButton";

export default function ProfileInfoCard() {
  const { user } = useAppStore();

  return (
    <GradientCard gradientId="profile-info-card" minHeight={120} contentClassName="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Información Personal</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Nombre de Usuario
          </label>
          <input
            type="text"
            value={user?.username ?? ""}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white cursor-not-allowed opacity-75"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Nombres</label>
          <input
            type="text"
            value={user?.name ?? ""}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white cursor-not-allowed opacity-75"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Apellidos</label>
          <input
            type="text"
            value={user?.last_name ?? ""}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white cursor-not-allowed opacity-75"
          />
        </div>

        <div className="flex justify-end pt-2">
          <EditProfileInfoButton />
        </div>
      </div>
    </GradientCard>
  );
}
