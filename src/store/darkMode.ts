import { create } from "zustand";

type DarkModeStore = {
    darkMode: boolean,
    setDarkMode: (data: boolean) => void
}

export const useAppDarkStore = create<DarkModeStore>((set)=>({
    darkMode: false,
    setDarkMode: (data) => {
        set({ darkMode: data })
    }
}));