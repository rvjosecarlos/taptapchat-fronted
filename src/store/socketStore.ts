import { create } from "zustand";

type SocketStore = {
    wscStore: WebSocket | null,
    setWscStore: (data: WebSocket | null) => void
};

export const useSocketStore = create<SocketStore>((set) => ({
    wscStore: null,
    setWscStore: (data) => {
        set({ wscStore: data });
    }
}));