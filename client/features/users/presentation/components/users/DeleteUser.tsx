"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { User } from "@/features/users/domain/entities/user";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import { handleApiErrors } from "@/lib/api/errors";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { deleteUserAction } from "../../actions/user-actions";

type DeleteUserProps = {
  user: User;
  className?: string;
  showLabel?: boolean;
};

export default function DeleteUser({ user, className, showLabel = false }: DeleteUserProps) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    const result = await deleteUserAction(user.id);

    if (result.ok) {
      showSuccessToast("Usuario eliminado correctamente");
      return true;
    }

    handleApiErrors(result.errors.length > 0 ? result.errors : ["Error al eliminar el usuario."]);
    return false;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar ${user.username}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Confirmar Eliminacion"
        description="Esta accion desactivara el usuario en el sistema."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Usuario:</span>
              <span className="font-semibold text-white">{user.username}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Correo:</span>
              <span className="font-semibold text-white">{user.email}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Role:</span>
              <span className="font-semibold text-orange-400">{user.role}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
