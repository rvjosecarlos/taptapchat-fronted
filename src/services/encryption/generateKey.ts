export const generateKey = async ( ) => {
    const secretCodificada = new TextEncoder().encode(import.meta.env.VITE_S_K);
    const secretKey = await crypto.subtle.importKey(
        "raw",
        secretCodificada,
        { name: "AES-GCM", length: 128 },
        true,
        ["encrypt", "decrypt"]
    );

    return secretKey;
};