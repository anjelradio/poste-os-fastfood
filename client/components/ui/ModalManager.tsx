"use client"
import { useAppStore } from "@/lib/store/appStore";

export const ModalManager = () => {
  const { modal, closeModal } = useAppStore();

  if (!modal) return null;

  return (
    <>
      {modal === "editProfile" && null}
    </>
  );
};
