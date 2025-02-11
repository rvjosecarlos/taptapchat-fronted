import { downloadBackup, uploadBackup } from "../../api/backupAPI";
import { dataUser } from "../../config/dataUser";
import { Contact, Message, ServerResponse, User } from "../../types";
import { decryptMessage } from "../encryption/desencriptar";
import { encryptMessage } from "../encryption/encriptar";

export const createBackup = async () => {
    const jsonBD = await dataUser.respaldarBD();
    const userId = jsonBD.user.id;
    const bdString = JSON.stringify(jsonBD);
    console.log("Encriptando...");
    const encryptedBD = await encryptMessage(bdString);

    // Aqui se llama al endpoint que envia el string y en el servidor se hace el blob y se sube a drive
    const res: ServerResponse = await uploadBackup( userId, encryptedBD );
    return res;
};

export const insertDataImport = async (userId: User['id']) => {
    
    // Aqui la funcion para importar
    const res: ServerResponse = await downloadBackup(userId);

    if( !res.success && res.errors ){
        return res;
    };

    // Aqui la funcion para pasar de blob a string
    
    const bdString = await decryptMessage(res.data as string);
    const jsonBD = JSON.parse(bdString);
    console.log("BD recuperada",jsonBD);
    
    // Aqui las funciones para agregar los datos a la BD
    const { contact, mensajes } = jsonBD;

    // Eliminar la bd existenten
    await dataUser.clearDB();

    // Importa contactos
    await Promise.all(contact.map( async (contacto: Contact) => {
        console.log(contacto);
        await dataUser.addContact(contacto)
    }));
    console.log("Contactos importados");

    // Importa los mensajes
    await Promise.all(mensajes.map( async (mensaje: Message) => await dataUser.addNewMessage(mensaje) ));
    console.log("Importa los mensajes");

    return res;
};