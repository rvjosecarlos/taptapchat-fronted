import { create } from "zustand";
import { ActiveContact, Message } from "../types";

type ChatStore = {
    activeContact: ActiveContact | null,
    historyMessage: Message[],
    refNewMessage: HTMLDivElement,
    viewEmojis: boolean,
    setActiveContact: (data: ActiveContact | null) => void,
    setHistoryMessage: (data: Message[]) => void,
    setRefNewMessage: (html: HTMLDivElement) => void,
    setViewEmojis: (data: boolean) => void
};

export const useChatStore = create<ChatStore>((set) => ({
    activeContact: null,
    historyMessage: [],
    refNewMessage: null!,
    viewEmojis: false,
    setActiveContact: (data) => {
        set({ activeContact: data });
    },
    setHistoryMessage: (data) => {
        set({ historyMessage: data });
    },
    setRefNewMessage: (data) => {
        set({ refNewMessage: data });
    },
    setViewEmojis: (data) => {
        set({ viewEmojis: data })   
    }
}));