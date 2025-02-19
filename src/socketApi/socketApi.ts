import { User } from "../types";

const wssUrl = import.meta.env.VITE_WS_SERVER;

type CreateWSCParams = {
    clientId: User['id'],
    contactos: string[],
    username: User['name'],
    imgUrl?: User['imgUrl'],
    setReconectando: React.Dispatch<React.SetStateAction<boolean>>;
}

export const createWSC = async (config: CreateWSCParams) => {
    const { clientId, contactos, username, setReconectando } = config;
    const imgUrl = config.imgUrl;
    try{
        // el parametro token no se esta ocupando
        const wsc = new WebSocket(wssUrl + `?token=${"token"}&clientId=${clientId}`);
        let idInterval: NodeJS.Timeout | null = null;
        wsc.addEventListener("open", () => {    
            
            setReconectando(false);

            idInterval = setInterval(() => {
                if( wsc.readyState === WebSocket.OPEN ){
                    console.log("No te mueras servidor");
                    wsc.send(JSON.stringify({
                        type: "heartbeat",
                        originUserId: clientId
                    }));
                }
            }, 10000);

            wsc.send(JSON.stringify({
                type: "online",
                originUserId: clientId,
                destinationUserId: "",
                message: "",
                updateNameContact: username,
                updateImgUrl: imgUrl,
                contacts: JSON.stringify(contactos)
            }));

            console.log("conexion abierta con el servidor");

        });
        return { wsc, idInterval };
    }
    catch(error){
        console.error(error);
        return { wsc: null, idInterval: null, error: "Error al crear wl WS" }
    }
}