import { create } from "zustand";
import { Contact } from "../types";

type ContactListStore = {
    contactos: Contact[],
    contactosFiltrados: Contact[],
    setContactos: (data: Contact[]) => void,
    setContactosFiltrados: (data: Contact[]) => void,
};

export const useContactListStore = create<ContactListStore>((set)=>({
    contactos: [],
    contactosFiltrados: [],
    setContactos: (data) => {
        set({ contactos: data });
    },
    setContactosFiltrados: (data) => {
        set({ contactosFiltrados: data });
    }
}))