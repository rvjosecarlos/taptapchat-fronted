import { create } from "zustand";
import { User } from "../types";


type UserStore = {
    userProfile: User | null,
    newUser: boolean,
    emailReset: string,
    resetPassword: boolean,
    cerrarSesion: boolean,
    setUserProfile: (data: User | null) => void,
    setNewUser: (data: boolean) => void,
    setEmailReset: (data: string) => void,
    setResetPassword: (data: boolean) => void,
    setCerrarSesion: (data: boolean) => void
};

export const useUserStore = create<UserStore>((set) => ({
    userProfile: null,
    newUser: false,
    emailReset: "",
    resetPassword: false,
    cerrarSesion: false,
    setUserProfile: (data) => {
        set({ userProfile: data })
    },
    setNewUser: (data) => {
        set({ newUser: data })
    },
    setEmailReset: (data) => {
        set({ emailReset: data })
    },
    setResetPassword: (data) => {
        set({ resetPassword: data })
    },
    setCerrarSesion: (data) => {
        set({ cerrarSesion: data });
    }
}));