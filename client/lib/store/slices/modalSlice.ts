import { create, StateCreator } from "zustand";

type ModalType = "editProfile" | "changeEmail" | "changePassword" | null;

export interface ModalSlice {
  modal: ModalType;
  data?: any;

  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const createModalSlice: StateCreator<ModalSlice> = (set) => ({
  modal: null,
  data: undefined,

  openModal: (modal, data) => set({ modal, data }),
  closeModal: () => set({ modal: null, data: undefined }),
});
