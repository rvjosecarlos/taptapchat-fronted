import { flushSync } from "react-dom";
import { Suspense, useEffect, useRef, useState } from "react";
import { appZustandStore } from "../../store";
import { dataUser } from "../../config/dataUser";
import Message from "./Message";
import Spinner from "../Spinner";
import { decryptMessage } from "../../services/encryption/desencriptar";

export default function MessageHistory(){
    const ref = useRef<HTMLDivElement>(null);
    const refLoadSpinner = useRef<HTMLDivElement>(null);
    const [ totalMessages, setTotalMessages ] = useState(0);

    const activeContact = appZustandStore.useChatStore( state => state.activeContact );
    const historyMessage = appZustandStore.useChatStore( state => state.historyMessage );
    const setHistoryMessage = appZustandStore.useChatStore( state => state.setHistoryMessage );
    const setRefNewMessage = appZustandStore.useChatStore( state => state.setRefNewMessage );    
    const setViewEmojis  = appZustandStore.useChatStore( state => state.setViewEmojis );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const { loadInitMessages, loadPageMessages, loadTotalMessages } = dataUser;
    let firstRender = true;
    let pagina = 1;
    let alturaScroll = 0;
    
    useEffect(() => {
        firstRender = true;
        pagina = 1;
        alturaScroll = ref.current!.scrollHeight;
        getTotalMessages();
        getInitialMessages();
        const observador = suscribeSpinner();
        return () => observador.disconnect();       
    },["",activeContact]);

    useEffect(() => {
        setRefNewMessage(ref.current!); 
    },["",activeContact, historyMessage]);

    const suscribeSpinner = () => {
        const observador = new IntersectionObserver( arr => {
            if( arr[0].isIntersecting && !firstRender ){
                console.log("Observando");
                getMoreMessages();
            };
            firstRender = false;
        });
        refLoadSpinner.current && observador.observe(refLoadSpinner.current);
        return observador;
    };

     
    const getInitialMessages = async () => {
        // Cuando den click hacer la consulta a indexedDB y cargar los mensajes del contacto seleccionado
        const encryptedMessages = await loadInitMessages(activeContact!.id) || [];
        const messages = await Promise.all( encryptedMessages.map(async mensaje => 
            ({ ...mensaje, message: await decryptMessage(mensaje.message) })
        ));
        flushSync(()=>{
            setHistoryMessage(messages);
        });

        // Posicionar el scroll al final del contenedor y guardar su altura para el scroll infinito hacia arriba
        if( ref.current ){
            ref.current!.scrollTop = ref.current!.scrollHeight;
            alturaScroll = ref.current.scrollHeight;
        };
    };

    const getMoreMessages = () => {


        setTimeout(async () => {
            const currentId = appZustandStore.useChatStore.getState().activeContact!.id;
            const currentHistoryMessages = appZustandStore.useChatStore.getState().historyMessage;
            const moreMessagesEncrypted = await loadPageMessages(currentId, pagina);
            const moreMessages = await Promise.all( moreMessagesEncrypted.map(async mensaje => 
                ({ ...mensaje, message: await decryptMessage(mensaje.message) })
            ));

            flushSync(() => {
                    setHistoryMessage([...moreMessages, ...currentHistoryMessages])
            });
            pagina++;

            // Restar la altura anterior para ir colocando el scroll en el mismo sitio donde cargan los mensajes
            if( ref.current ){
                console.log(alturaScroll, ref.current.scrollHeight, ref.current.scrollTop);
                ref.current!.scrollTop = ref.current.scrollHeight - alturaScroll;
                alturaScroll = ref.current.scrollHeight;
            };
        },500);
    };

    const getTotalMessages = async () => {
        const currentId = appZustandStore.useChatStore.getState().activeContact!.id;
        const totalMessages = await loadTotalMessages(currentId);
        setTotalMessages(totalMessages);
    }

    return(
        <Suspense fallback={<Spinner/>}>
            <div 
                ref={ref}
                className={`w-full absolute top-20 bottom-20 p-4 overflow-y-scroll transition-colors duration-500 ${ darkMode ? "bg-[#121212]" : "imagen-chat-bg" }`}
                onClick={() => setViewEmojis(false)}
            >
                <div 
                    ref={refLoadSpinner}
                    className={`p-5 flex justify-center ${historyMessage.length < 50 || historyMessage.length >= totalMessages ? "hidden" : ""}`}
                >
                    <Spinner />
                </div>
                {
                    historyMessage.map( mensaje => 
                        <div key={mensaje.id}>
                            <Message 
                                message={mensaje.message}
                                send={mensaje.send}
                                time={mensaje.time}
                                leido={mensaje.leido}
                            />
                        </div>
                    )
                }
            </div>
        </Suspense>
    );
}