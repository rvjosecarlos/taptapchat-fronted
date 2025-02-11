import { useRef, useState } from "react";
import { appZustandStore } from "../../store";
import { dataUser } from "../../config/dataUser";
import { flushSync } from "react-dom";
import { encryptMessage } from "../../services/encryption/encriptar";
import EmojisContainer from "./EmojisContainer";

export default function FormChat(){
    const ref = useRef<HTMLTextAreaElement>(null);
    const [ msj, setMsj ] = useState("");
    const activeContact = appZustandStore.useChatStore( state => state.activeContact );
    const setHistoryMessage = appZustandStore.useChatStore( state => state.setHistoryMessage );
    const historyMessage = appZustandStore.useChatStore( state => state.historyMessage );
    const refNewMessage = appZustandStore.useChatStore( state => state.refNewMessage );
    const wscStore = appZustandStore.useSocketStore( state => state.wscStore );
    const userProfile = appZustandStore.useUserStore( state => state.userProfile );
    const setContactos = appZustandStore.useContactListStore( state => state.setContactos );
    const setContactosFiltrados = appZustandStore.useContactListStore( state => state.setContactosFiltrados );
    const viewEmojis = appZustandStore.useChatStore( state => state.viewEmojis );
    const setViewEmojis = appZustandStore.useChatStore( state => state.setViewEmojis );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const { addNewMessage, updateContact } = dataUser;

    const handleClick = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent) => {
        setViewEmojis(false);
        
        // Aqui se debe disparar el evento del web socket

        e.preventDefault();
        console.log('Enviando mensaje...');
        if( msj ){
            const mensaje = {
                id: activeContact!.id + Date.now(),
                leido: true,
                message: msj,
                send: true,
                time: Date.now(),
                contactId: activeContact!.id
            };

            //Encriptar el mensaje
            const mensajeEncriptado = await encryptMessage(msj);
            const mensajeParaEnviar = { ...mensaje, message: mensajeEncriptado }

            try{                

                if( wscStore ){
                    wscStore.send(JSON.stringify({
                        type: "message",
                        originUserId: userProfile!.id,
                        destinationUserId: activeContact!.id,
                        message: mensajeParaEnviar
                    }));
                }
                else{
                    console.log("No hay websocket");
                }
            }
            catch(error){
                console.log(error);
            }

            flushSync( () => {
                setHistoryMessage([...historyMessage, mensaje]);            
                setMsj("");
            }); 

            // Aqui va la logica para definir si se envio o no dependiendo de la respuesta del server
            addNewMessage(mensajeParaEnviar);
            
            // Actualizar el lastMessage
            updateContact({ userId: activeContact!.id, status: false, mensaje: `Tú: ${mensaje.message}` });
            setContactos( appZustandStore.useContactListStore.getState().contactos.map( contacto => {
                if( contacto.id === activeContact!.id ){
                    contacto.lastMessage = `Tú: ${mensaje.message}`;
                }
                return contacto;
            }));
    
            setContactosFiltrados( appZustandStore.useContactListStore.getState().contactosFiltrados.map( contacto => {
                if( contacto.id === activeContact!.id ){
                    contacto.lastMessage = `Tú: ${mensaje.message}`;
                }
                return contacto;
            }));
            refNewMessage.scrollTop = refNewMessage.scrollHeight;
            
            ref.current!.style.height = "40px";
        };
    };

    const ajutarInput = () => {
        const textArea = ref.current;
        if( textArea ){
            textArea.style.height = "40px"; // Altura minima para empezar a crecer
            const altura = Number(textArea.style.height.replace("px", ""));
            if( altura <= 120 ) textArea.style.height = textArea.scrollHeight + "px";
        }
    };

    return(
        <div className={`${ darkMode ? "bg-[#252525]" : "bg-white" } min-h-20 absolute bottom-0  w-full flex items-center`}>
            {
                viewEmojis &&<EmojisContainer setMsj={setMsj}/>
            }
            <div className="bg-black flex justify-center items-center ml-2 rounded-lg  hover:bg-slate-700">
                <button
                    onClick={() => setViewEmojis(!viewEmojis)}
                    className="text-white font-bold p-2"
                >   
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                    </svg>
                </button>
            </div>
            <form 
                className={`${ darkMode ? "bg-[#252525] border-[#252525]" : "border-slate-200 bg-white" } w-full border-t py-5 pr-5 pl-2`}
                onSubmit={(e) => handleClick(e)}
            >
                <div className="flex gap-2">
                    <textarea
                        ref={ref} 
                        className={`${ darkMode ? "bg-[#333333] border-[#252525] focus:border-[#505050] text-white" : "focus:border-slate-400" } w-full h-10 resize-none p-1 border-2 rounded-md focus:outline-none `}
                        placeholder="Escribe tu mensaje"
                        onChange={ (e) => {
                            setMsj(e.target.value);
                            //if( !e.target.value || e.target.value.length <= 50 ) ref.current!.style.height = "40px";
                        }}
                        value={msj}
                        onInput={ajutarInput}
                        onKeyDown={(e) => {
                            if( e.key === "Enter" ){
                                handleClick(e)
                            };
                        }}
                    />
                    <div className="flex justify-center items-end">
                        <button 
                            aria-label="Enviar mensaje"
                            type="button" 
                            className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-slate-700"
                            onClick={(e) => handleClick(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}