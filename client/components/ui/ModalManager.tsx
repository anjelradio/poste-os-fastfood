"use client"
import { useAppStore } from "@/lib/store/appStore";
import { ChangeInfoModal } from "../perfil/ChangeInfoModal";

export const ModalManager = () => {
  const { modal, closeModal } = useAppStore();

  if (!modal) return null;

  return (
    <>
      {modal === "editProfile" && <ChangeInfoModal />}
    </>
  );
};