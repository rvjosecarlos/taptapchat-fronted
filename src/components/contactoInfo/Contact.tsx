import Avatar from "./Avatar";
import type { Contact as ContactType } from "../../types";
import { appZustandStore } from "../../store";
import { dataUser } from "../../config/dataUser";

type ContactProps = {
} & Pick<ContactType, "id" | "toList" | "emailContact" | "nameContact" | "lastMessage" | "timeDisconnected" | "online" | "leido" | "imgUrl">;

export default function Contact( { id, toList, nameContact, emailContact, lastMessage = "", timeDisconnected, online, leido, imgUrl }: ContactProps ){
    // colocar animate-bounce para los mensajes no leidos
    
    const setActiveContact = appZustandStore.useChatStore( state => state.setActiveContact );
    const activeContact = appZustandStore.useChatStore( state => state.activeContact );
    const setContactos = appZustandStore.useContactListStore( state => state.setContactos ); 
    const contactos = appZustandStore.useContactListStore( state => state.contactos );
    const setContactosFiltrados = appZustandStore.useContactListStore( state => state.setContactosFiltrados );
    const contactosFiltrados = appZustandStore.useContactListStore( state => state.contactosFiltrados );
    const setShowChatElement = appZustandStore.useModalStore( state => state.setShowChatElement );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleClick = async () => {
        if(!toList) return;

        setShowChatElement(true);

        setActiveContact({
            id,
            nameContact,
            online,
            timeDisconnected,
            imgUrl
        });

        // Actualiza el estado de leido para quitar la animacion y el punto rojo que notifica el mensaje nuevo
        if( !leido ){
            setContactos( contactos.map( contacto => {
                if( contacto.id === id ){
                    contacto.leido = true;
                };
                return contacto;
            }));
            setContactosFiltrados( contactosFiltrados.map( contacto => {
                if( contacto.id === id ){
                    contacto.leido = true;
                };
                return contacto;
            }));
            await dataUser.updateContact({ userId: id, leido: true });
        };
    };

    

    return(
        <div 
            title={ nameContact ? `${nameContact}\n${emailContact}` : nameContact}
            className={`relative px-2 container flex gap-2 items-center rounded sm:bg-auto transition-colors duration-500
                ${activeContact?.id === id && toList && !darkMode && "bg-slate-100" }
                ${activeContact?.id === id && toList && darkMode && "bg-[#333333]" }
                ${ toList && darkMode && "hover:bg-[#333333] cursor-pointer py-2" }
                ${ toList && !darkMode && "hover:bg-slate-100 cursor-pointer py-2" }
                ${ !leido && toList && "animate-bounce mt-0"  }
                ${ darkMode ? "bg-[#1E1E1E]" : "bg-white" }`
            }
            onClick={handleClick}
        >
            <div>
                <Avatar     
                    online={online}
                    toList={true}
                    imgUrl={imgUrl}
                />
            </div>
            <div>
                <h2 className={`font-semibold whitespace-nowrap ${ darkMode ? "text-white" : "text-black" }`}>{nameContact.length > 20 ? nameContact.substring(0,2).trim() : nameContact}</h2>
                { toList && <p className={`${ darkMode ? "text-slate-200" : "text-slate-500" } text-xs text-slate-400 whitespace-nowrap font-semibold`}>{ lastMessage.length > 20 ? lastMessage.substring(0,20).trim() + "..." : lastMessage.substring(0,20).trim()}</p> }
                <p className={`${ darkMode ? "text-slate-200" : "text-slate-500" } text-xs whitespace-nowrap`}>{ online ? "En línea" : /*timeDisconnected*/ "Desconectado" }</p>
            </div>
            { 
                !leido && toList && <span className="absolute bottom-3 left-10 rounded-full w-3 h-3 bg-red-500 text-white text-xs flex justify-center items-center"></span>
            }
        </div>
    );
}