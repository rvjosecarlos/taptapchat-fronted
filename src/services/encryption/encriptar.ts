import { Message } from "../../types";
import { generateKey } from "./generateKey";

export const encryptMessage = async ( mensaje: Message['message']) => {
    const mensajeCodificado = new TextEncoder().encode(mensaje);
    const eevee = crypto.getRandomValues(new Uint8Array(12)); // Crea un vector inical para encriptar y que siempre sea diferente
    const secretKey = await generateKey();
    //console.log("SECRETA", secretKey);

    const encriptado = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: eevee
        },
        secretKey,
        mensajeCodificado
    );

    // Combiar el eevee y los datos encriptados
    const datosEncriptados = new Uint8Array(encriptado);
    const arrayCombinado = new Uint8Array(eevee.length + datosEncriptados.length);
    arrayCombinado.set(eevee);
    arrayCombinado.set(datosEncriptados, eevee.length);

    // Convertir a base64 para transmision por websocket, no debo olvidar que es un arreglo de caracteres asccii
    const arrayCombinadoBase64 = btoa(String.fromCharCode(...arrayCombinado));
    return arrayCombinadoBase64;
};