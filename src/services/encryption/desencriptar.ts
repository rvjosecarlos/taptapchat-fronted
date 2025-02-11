import { generateKey } from "./generateKey";

export const decryptMessage = async (message: string) => {
    const messageBase64Text = atob(message);
    const arrayCodigoAsccii = Uint8Array.from(messageBase64Text, (c) => c.charCodeAt(0) ); // Crea un arreglo de valores asscii, este arreglo tiene los 12 bytes de eevee y el resto del mensaje
    const eevee = arrayCodigoAsccii.slice(0,12);
    const messageEncrypted = arrayCodigoAsccii.slice(12);
    const secretKey = await generateKey();


    const descryptData =  await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: eevee
        },
        secretKey,
        messageEncrypted
    );

    const codificador = new TextDecoder();
    const mensaje = codificador.decode(descryptData);
    return mensaje;
};