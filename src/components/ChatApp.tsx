import { flushSync } from "react-dom";
import { appZustandStore } from "../store";
import Chat from "./areaChat/Chat";
import ChatInitial from "./areaChat/ChatInitial";
import ContactList from "./listaContactos/ContactList";
import { useEffect } from "react";
import { Message, ServerResponse, WSServerResponse } from "../types";
import { dataUser } from "../config/dataUser";
import { createWSC } from "../socketApi/socketApi";
import { searchContactById } from "../api/userAPI";
import { getPendingMessages } from "../api/pendingMessagesAPI";
import { decryptMessage } from "../services/encryption/desencriptar";
import Spinner from "./Spinner";
import { logout } from "../api/authAPI";
import Logo from "./Logo";

let render = 0;

// API Notification
const confignotification = async () => {
    const res = await Notification.requestPermission();
    console.log("REspuesta de notificacion", res);
};

export default function ChatApp(){

    const { loadInitMessages } = dataUser;

    const userProfile = appZustandStore.useUserStore( state => state.userProfile );
    const setUserProfile = appZustandStore.useUserStore( state => state.setUserProfile );
    const setContactos = appZustandStore.useContactListStore( state => state.setContactos );
    const setContactosFiltrados = appZustandStore.useContactListStore( state => state.setContactosFiltrados );
    const setWscStore = appZustandStore.useSocketStore( state=> state.setWscStore );
    const activeContact = appZustandStore.useChatStore( state => state.activeContact );
    const setActiveContact = appZustandStore.useChatStore( state => state.setActiveContact );
    const setHistoryMessage = appZustandStore.useChatStore( state => state.setHistoryMessage );
    const cerrarSesion = appZustandStore.useUserStore( state => state.cerrarSesion );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );
    const setDarkMode = appZustandStore.useAppDarkStore( state => state.setDarkMode );

    useEffect(() => {
        console.log("Se ejecuta el use effect");
        // Carga el tema
        const darkModeString = localStorage.getItem("darkMode");
        setDarkMode(darkModeString ? JSON.parse(darkModeString) : false);

        window.addEventListener('resize', () => {
            document.documentElement.style.setProperty(
              '--vh',
              `${window.innerHeight * 0.01}px`
            );
            console.log(window.innerHeight, "ALTURA");
        });
        
        // Solo se ejecuta en el primer renderizado
        if( render === 1 ){
            render = 0;
            return;
        };

        render++;

        // Carga los contactos
        const getContactos = async () => {
            const loadContacts = await dataUser.loadContactList(userProfile!.id);
            console.log("contactos cargados", loadContacts);
            setContactos(loadContacts);
            setContactosFiltrados(loadContacts);
            return loadContacts;
        };

        // Carga mensajes pendientes desde el servidor remoto
        const getAndInsertPendingMessages = async () => {
            console.log("Obtener los mensajes pendientes");
            const res: ServerResponse = await getPendingMessages(userProfile!.id);
            if( res.success && res.data ){
                const mensajes: Message[] = JSON.parse(JSON.stringify(res.data));

                // Crear un arreglo de promesas para pasarlas a promise.all y pueda bloquear el codigo para que no se siga
                const promesas = mensajes.map(async (mensaje) => {
                    return [
                        dataUser.updateContact({ userId: mensaje.contactId, status: false, mensaje: await decryptMessage(mensaje.message), leido: false }),
                        dataUser.addNewMessage(mensaje)
                    ]
                }).flat();
                
                console.log("promesas", promesas);
                await Promise.all( promesas );     
            };
        };

        // Carga mensajes iniciarles desde indexedDB
        const getInitialMessages = async (mensaje: Message, idActiveContact: string) => {
            // Cuando den click hacer la consulta a indexedDB y cargar los mensajes del contacto seleccionado
            const encryptedMessages = await loadInitMessages(idActiveContact) || [];
            const messages = await Promise.all(encryptedMessages.map( async mensaje => 
                ({ ...mensaje, message: await decryptMessage(mensaje.message) }) 
            ));
            flushSync(()=>{
                setHistoryMessage([...messages, mensaje]);
            });
        };

        const suscribeWebSocket = async () => {

            // Carga mensajes pendientes y actualiza el lastmessage
            await getAndInsertPendingMessages();
            const loadContacts = await getContactos();        

            // Conectar al servidor websocket
            const idsContactos = loadContacts.map( contacto => contacto.id);
            const wsc = await createWSC(userProfile!.id, idsContactos, userProfile!.name, userProfile?.imgUrl);

            if( typeof wsc === "string" ){
                console.log("Error al crear el Websocket");
                return;
            }

            setWscStore(wsc);            
            console.log("Se suscribe el websocket para mensajes entrantes");

            wsc.addEventListener("message", async (data) => {
                console.log("Mensaje desde el servidor",data);
                if( data && typeof data.data === "string" ){
                    const resWS: WSServerResponse = JSON.parse(data.data);
                    console.log("resWS", resWS);

                    if( resWS.type && resWS.type === "message" ){
                        console.log("ES un mensaje entrante", resWS.message);

                        if( Notification.permission === "default" ){
                            confignotification();
                        };

                        const addNewMessage = dataUser.addNewMessage;

                        // Aqui va la logica para definir si se envio o no dependiendo de la respuesta del server
                        const mensaje = {
                            id: userProfile!.id + Date.now(),
                            leido: true,
                            message: await decryptMessage(resWS.message.message),
                            send: false,
                            time: Date.now(),
                            contactId: resWS.originUserId
                        };

                        
                        // Revisa que el contacto exista el la lista y si no, se crea
                        const resSearchContact: ServerResponse = await searchContactById(resWS.originUserId);
                        if( !appZustandStore.useContactListStore.getState().contactos.find(  contacto => contacto.id === resWS.originUserId ) ){
                            console.log("ENTROO EN EL ELSE");                            

                            // Se prepara el nuevo contacto
                            const newContact = {
                                "id": JSON.parse(JSON.stringify(resSearchContact.data))!.id,
                                "nameContact": JSON.parse(JSON.stringify(resSearchContact.data))!.name,
                                "emailContact": JSON.parse(JSON.stringify(resSearchContact.data))!.email,
                                "toList": false,
                                "lastMessage": mensaje.message,
                                "online": false,
                                "timeDisconnected": 0,
                                "leido": false,
                                "userId": userProfile!.id,
                                "imgUrl": JSON.parse(JSON.stringify(resSearchContact.data)).imgUrl
                            };

                            console.log("Nuevo contacto",newContact);

                            dataUser.addContact(newContact);

                            
                            // Renderiza el nuevo contacto
                            setContactosFiltrados([...appZustandStore.useContactListStore.getState().contactos, { ...newContact, online: true }]);
                            setContactos([...appZustandStore.useContactListStore.getState().contactos, { ...newContact, online: true }]);
                        }
                        else{
                            actualizarStatusContactos({resWS, estado: true, mensaje: mensaje.message});
                            await dataUser.updateContact({ userId: resWS.originUserId, status: false, mensaje: mensaje.message });
                        }

                        // Valida que el contacto que esta seleccionado es el mismo que recibe el mensaje                            
                        const activeContactStore = appZustandStore.useChatStore.getState().activeContact;
                        
                        if( activeContactStore && activeContactStore.id === resWS.originUserId ){
                            await getInitialMessages(mensaje, activeContactStore.id);
                            appZustandStore.useChatStore.getState().refNewMessage.scrollTop = appZustandStore.useChatStore.getState().refNewMessage.scrollHeight;
                        }
                        else{
                            // Si no es el mismo contacto el que esta seleccionado y recibe el mensaje entonces hacer la alerta
                            await dataUser.updateContact({ userId: resWS.originUserId, leido: false });
                            actualizarStatusContactos({ resWS, leido: false });
                        }
                                              

                        console.log("se agrega el mensaje:", mensaje);
                        addNewMessage({ ...mensaje, message: resWS.message.message });

                        // Notificar al usuario
                        if( Notification.permission === "granted" ){

                            const contacto = appZustandStore.useContactListStore.getState().contactos.find( contacto => contacto.id === resWS.originUserId );

                            console.log("Permiso concedido");
                            new Notification("TapTapChat: ", {
                                body: `${JSON.parse(JSON.stringify(resSearchContact.data))!.name} : ${ mensaje.message.length > 70 ? mensaje.message.substring(0, 70) + "..." : mensaje.message.substring(0, 70)}`,
                                icon: contacto?.imgUrl
                            });
                        };                        
                    }
                    else if(resWS.type && resWS.type === "online"){
                        // Lógica para cambiar el estado de un contacto
                        
                        /* Aquí se recibe la respuesta de los contacto que a su vez recibieron el mensaje
                        #  de aviso de contacto en línea
                        */
                        console.log("Se recibe mensaje de en linea de un contacto que acaba de conectarse", resWS);
                        //await dataUser.updateContact({ originUserId: resWS.originUserId, status: true });
                        
                        // Aqui va la logica para actualizar el nombre si es que lo trae consigo
                        await dataUser.updateContact({ userId: resWS.originUserId, nameContact: resWS.updateNameContact, imgUrl: resWS.updateImgUrl });

                        // REVISAR LA RESPUESTA
                        wsc.send(JSON.stringify({ 
                            ...resWS, 
                            type: "contactAlive", 
                            originUserId: userProfile?.id, 
                            destinationUserId: resWS.originUserId
                        }));

                        actualizarStatusContactos({resWS, estado: true, nameContact: resWS.updateNameContact, imgUrl: resWS.updateImgUrl });

                    }
                    else if(resWS.type && resWS.type === "contactAlive"){
                        console.log("Se recibe un mensaje de respuesta de estado en linea de", resWS.originUserId);
                        console.log(resWS);
                        //await dataUser.updateContact({ originUserId: resWS.originUserId, status: true });
                        actualizarStatusContactos({resWS, estado: true});
                    }
                    else if(resWS.type && resWS.type === "offline"){
                        //await dataUser.updateContact({ originUserId: resWS.originUserId, status: false });
                        actualizarStatusContactos({resWS, estado: false});
                    }
                    else if( resWS.type && resWS.type === "duplicate-session" ){
                        await logout(userProfile!.id);
                        wsc.close();
                        await dataUser.clearAllBD();
                        alert("Se ha iniciado sesión en otro dispositivo o navegador");
                        console.log("Sesion duplicada");
                        setUserProfile(null);
                        setContactos([]);
                        setContactosFiltrados([]);
                        setWscStore(null);
                        setHistoryMessage([]);  
                    }
                    else if( resWS.type && resWS.type === "update-user" ){
                        // Actualiza el nombre del contacto
                        console.log("Se recibe mensaje para actualizar nombre de contacto", resWS.updateNameContact);
                        console.log("Tipo del mensaje recibido", typeof resWS.message);
                        await dataUser.updateContact({ userId: resWS.originUserId, nameContact: resWS.updateNameContact, imgUrl: resWS.updateImgUrl });
                        actualizarStatusContactos({ resWS, nameContact: resWS.updateNameContact, imgUrl: resWS.updateImgUrl });
                    }
                };
            });

            // Cuando se cierra el websocket
            wsc.addEventListener("close", () => {
                console.log("Conexión cerrada con el servidor");
                setContactos([]);
                setContactosFiltrados([]);
                setWscStore(null);
                setHistoryMessage([]); 
                setUserProfile(null);
            });
        }

        // Crear y suscribir el websokcet
        suscribeWebSocket();
        
        return () => {
            console.log(`Funcion limpiadora, ${appZustandStore.useSocketStore.getState().wscStore}`);
            appZustandStore.useSocketStore.getState().wscStore?.close(1000, "Cierre de conexion por funcion limpiadora");
            setContactos([]);
            setContactosFiltrados([]);
            setWscStore(null);
            setHistoryMessage([]);           
        }
    },[]);

    // Funcion para actualizar el estado de los contactos
    const actualizarStatusContactos = ( { resWS, estado, mensaje, leido, nameContact, imgUrl } : { resWS: WSServerResponse, estado?: boolean, mensaje?: string, leido?: boolean, nameContact?: string, imgUrl?: string} ) => {
        setContactos( appZustandStore.useContactListStore.getState().contactos.map( contacto => {
            if( contacto.id === resWS.originUserId ){
                if ( typeof estado === "boolean" ) contacto.online = estado;
                if( mensaje ) contacto.lastMessage = mensaje;
                if( typeof leido === "boolean" ) contacto.leido = leido;
                if( nameContact ) contacto.nameContact = nameContact;
                if( imgUrl ) contacto.imgUrl = imgUrl;
                console.log("nombre del contacto", nameContact);
            }
            return contacto;
        }));

        setContactosFiltrados( appZustandStore.useContactListStore.getState().contactosFiltrados.map( contacto => {
            if( contacto.id === resWS.originUserId ){
                console.log("Se actualiza el estado de un contacto", {resWS, estado, mensaje, leido});
                if( typeof estado === "boolean" ) contacto.online = estado;
                if( mensaje ) contacto.lastMessage = mensaje;
                if( typeof leido === "boolean" ) contacto.leido = leido;
                if( nameContact ) contacto.nameContact = nameContact;
                if( imgUrl ) contacto.imgUrl = imgUrl;
            }
            return contacto;
        }));

        const activeContactStore = appZustandStore.useChatStore.getState().activeContact;
        if( activeContactStore && typeof estado === "boolean"){
            setActiveContact({
                ...activeContactStore, 
                online: estado,
                nameContact: nameContact ? nameContact : activeContactStore.nameContact,
                imgUrl: imgUrl ? imgUrl : activeContactStore.imgUrl
            });
        };
    };

    return (
        <div 
            className={`flex h-screen w-full p-3 ${ darkMode ? "bg-[#121212]" : "bg-white" }`}
        >
            {
                cerrarSesion ?
                    <div className="flex justify-center items-center w-full">
                        <div className="flex flex-col gap-3 items-center">
                            <Spinner />
                            <p className={`${ darkMode && "text-white" } text-center`}>
                                Guardando copia de seguridad y cerrando sesión...
                            </p>  
                            <Logo className="h-32 w-32 bg-white rounded-lg"/>                          
                        </div>
                    </div>
                :

                <>
                    <ContactList />
                    { activeContact ? <Chat /> : <ChatInitial/> }
                </>
            }
        </div>
    )
}