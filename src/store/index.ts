import { useSocketStore } from "./socketStore";
import { useContactListStore } from "./contactListStore";
import { useChatStore } from "./chatStore";
import { useModalStore } from "./modalStore";
import { useUserStore } from "./userStore";
import { useAppDarkStore } from "./darkMode";

// Lista de mensajes
export const messages = [
    {
        "id": "msg1",
        "leido": true,
        "message": "Hola, ¿cómo estás?",
        "send": true,
        "time": 1633065600,
        "contactId": "1"
    }
]

export const contactos = [
    {
        "id": "1",
        "nameContact": "Ana González",
        "toList": true,
        "lastMessage": "Nos vemos pronto!",
        "online": false,
        "timeDisconnected": 5,
        "leido": true,
        "userId": "1"
    }
]

export const usuarioEjemplo = {
    id: "1",
    name: "Carlos",
    email: "correo@correo.com"
}

/*
type AppStore = {
    userProfile: User | null,
    newUser: boolean,
    contactos: Contact[],
    contactosFiltrados: Contact[],
    activeContact: ActiveContact | null,
    historyMessage: Message[],
    refNewMessage: HTMLDivElement,
    emailReset: string,
    modalAddContact: boolean,
    resetPassword: boolean,
    wscStore: WebSocket | null,
    showChatElement: boolean,
    showBackupView: boolean,
    showProfileView: boolean,
    setUserProfile: (data: User | null) => void,
    setNewUser: (data: boolean) => void,
    setContactos: (data: Contact[]) => void,
    setContactosFiltrados: (data: Contact[]) => void,
    setActiveContact: (data: ActiveContact | null) => void,
    setHistoryMessage: (data: Message[]) => void,
    setRefNewMessage: (html: HTMLDivElement) => void,
    setEmailReset: (data: string) => void,
    setModalAddContact: (data: boolean) => void,
    setResetPassword: (data: boolean) => void,
    setWscStore: (data: WebSocket | null) => void,
    setShowChatElement: (data: boolean) => void,
    setShowBackupView: (data: boolean) => void,
    setShowProfileView: (data: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
    userProfile: null,
    newUser: false,
    contactos: [],
    contactosFiltrados: [],
    activeContact: null,
    historyMessage: [],
    refNewMessage: null!,
    emailReset: "",
    modalAddContact: false,
    resetPassword: false,
    wscStore: null,
    showChatElement: false,
    showBackupView: false,
    showProfileView: false,
    setUserProfile: (data) => {
        set({ userProfile: data });
    },
    setNewUser: (data) => {
        set({ newUser: data })
    },
    setContactos: (data) => {
        set({ contactos: data });
    },
    setContactosFiltrados: (data) => {
        set({ contactosFiltrados: data });
    },
    setActiveContact: (data) => {
        set({ activeContact: data });
    },
    setHistoryMessage: (data) => {
        set({ historyMessage: data });
    },
    setRefNewMessage: (data) => {
        set({ refNewMessage: data });
    },
    setEmailReset: (data) => {
        set({ emailReset: data });
    },
    setModalAddContact: (data) => {
        set({ modalAddContact: data })
    },
    setResetPassword: (data) => {
        set({ resetPassword: data })
    },
    setWscStore: (data) => {
        set({ wscStore: data });
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

*/

export const appZustandStore = { 
    useChatStore, 
    useContactListStore, 
    useModalStore, 
    useSocketStore, 
    useUserStore,
    useAppDarkStore
};

