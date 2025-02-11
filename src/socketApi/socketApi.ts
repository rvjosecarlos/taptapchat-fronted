import { User } from "../types";

const wssUrl = import.meta.env.VITE_WS_SERVER;

export const createWSC = async (clientId: string, contactos: string[], username: User['name'], imgUrl?: User['imgUrl']) => {
    try{
        const wsc = new WebSocket(wssUrl + `?token=${"token"}&clientId=${clientId}`);

        wsc.addEventListener("open", () => {            

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
        return wsc;
    }
    catch(error){
        console.log(error);
        return "Error al crear la conexión ws"
    }
}