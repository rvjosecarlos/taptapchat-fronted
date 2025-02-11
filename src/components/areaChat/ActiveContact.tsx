import { appZustandStore } from "../../store";
import Contact from "../contactoInfo/Contact";

export default function ActiveContact(){
    const activeContact = appZustandStore.useChatStore( state => state.activeContact );
    const setActiveContact = appZustandStore.useChatStore( state => state.setActiveContact );
    const setShowChatElement = appZustandStore.useModalStore( state => state.setShowChatElement );
    const setHistoryMessage = appZustandStore.useChatStore( state => state.setHistoryMessage );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleClickJustForMovil = () => {
        setShowChatElement(false);
        // Aqui habia un flushsync
        setActiveContact(null);
        setHistoryMessage([]);
    }

    return(
        <div className={`min-h-20 p-4 border-b ${ darkMode ? "border-[#252525]" : "border-slate-200" }`}>
            {
                activeContact && 
                <div className="flex items-center">
                    <div
                        className={`mr-2 flex justify-center items-center rounded-full sm:hidden active:scale-150 transition-all duration-75 ${ darkMode ? "active:bg-[#333333] text-white": "active:bg-slate-200" }`}
                        onClick={handleClickJustForMovil}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </div>
                    <Contact 
                        id={activeContact.id}
                        nameContact={ activeContact.nameContact }
                        emailContact=""
                        lastMessage=""
                        leido={true}
                        timeDisconnected={ activeContact.timeDisconnected }
                        online={activeContact.online}
                        toList={false}
                        imgUrl={activeContact.imgUrl}
                    />
                </div>
            }
        </div>
    );
}