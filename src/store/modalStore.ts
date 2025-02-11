import { create } from "zustand";

type ModalStore = {
    modalAddContact: boolean,
    showChatElement: boolean,
    showBackupView: boolean,
    showProfileView: boolean,
    setModalAddContact: (data: boolean) => void,
    setShowChatElement: (data: boolean) => void,
    setShowBackupView: (data: boolean) => void,
    setShowProfileView: (data: boolean) => void
};

export const useModalStore = create<ModalStore>((set) => ({
    modalAddContact: false,
    showChatElement: false,
    showBackupView: false,
    showProfileView: false,
    setModalAddContact: (data) => {
        set({ modalAddContact: data })
    },
    setShowChatElement: (data) => {
        set({ showChatElement: data });
    },
    setShowBackupView: (data) => {
        set({ showBackupView: data })
    },
    setShowProfileView: (data) => {
        set({ showProfileView: data });
    }
}));