import SearchBar from "./SearchBar";
import Contact from "../contactoInfo/Contact";
import { appZustandStore } from "../../store";
import AddContactModal from "./AddContactModal";
import OptionsModal from "../Options/OptionsModal";
import ProfileMainData from "../contactoInfo/ProfileMainData";
import Logo from "../Logo";

export default function ContactList(){
    
    const contactosFiltrados = appZustandStore.useContactListStore( state => state.contactosFiltrados );
    const setModalAddContact = appZustandStore.useModalStore( state => state.setModalAddContact );
    const showChatElement = appZustandStore.useModalStore( state => state.showChatElement );
    const setViewEmojis  = appZustandStore.useChatStore( state => state.setViewEmojis );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleOpenModal = () => {
        setModalAddContact(true);
    };

    return (
        <section 
            className={`relative w-full sm:w-80 border-2 sm:border-r-0 rounded-l-lg sm:block transition-colors duration-500
                ${ showChatElement ? "hidden" : "block aparecer-contactlist" }
                ${ darkMode ? "bg-[#1E1E1E] border-[#252525]" : "bg-white" }
            `}
            onClick={() => setViewEmojis(false)}
        >
            <div className={`${ darkMode ? "bg-[#121212] border-[#252525] text-white" : "bg-white border-slate-200" } m-2 rounded-lg  border`}>
                <div className="flex justify-between items-center px-3 my-3">
                    <div className="flex items-center gap-2">
                        <Logo className="h-10 w-10"/>
                        <h1 className={`${ darkMode && "text-white"} font-semibold text-slate-500 text-sm`}>TapTap Chat</h1>
                    </div>
                    <OptionsModal />
                </div>
                
                <ProfileMainData />
                
                <div className="flex justify-between items-center">
                    <SearchBar />
                    <button 
                        title="Agregar un contacto"
                        aria-label="Agregar un contacto"
                        className={`flex justify-center w-10 h-9 m-2 p-1 rounded-md cursor-pointer ${ darkMode ? "hover:bg-[#333333] border-2 border-[#252525]" : "hover:bg-slate-200 border border-slate-300" }`}
                        onClick={handleOpenModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>

                    </button>
                </div>
            </div>
            <div className="w-full top-64 absolute bottom-0 flex flex-col gap-2 px-2 py-4 overflow-y-auto overflow-x-hidden">
                {
                    contactosFiltrados.length > 0 &&
                    contactosFiltrados.map( ({id, nameContact, emailContact, lastMessage, leido, timeDisconnected, online, imgUrl }) =>
                        <div 
                            className=""
                            key={id}
                        >
                            <Contact 
                                id={id}
                                toList={true}
                                nameContact={nameContact}
                                emailContact={emailContact}
                                lastMessage={ lastMessage }
                                leido={ leido }
                                timeDisconnected={timeDisconnected}
                                online={online}
                                imgUrl={imgUrl}
                            />
                        </div>
                    )
                }
            </div>
            <AddContactModal/>
        </section>
    );
}

