import { BDData, Contact, Message, User } from "../types";

let dbChat: IDBDatabase;
const RESULTS_PER_PAGE = 50;

export class dataUser {
    // Función para abrir la base de datos
    static createDataBase = async () => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const db = window.indexedDB.open("taptapchat", 1);

            db.onerror = () => {
                console.error("Error al crear la base de datos");
                reject(new Error("Error al crear la base de datos"));
            };

            db.onsuccess = (e) => {
                const target = e.target as IDBRequest;
                dbChat = target.result as IDBDatabase;
                resolve(dbChat);
            };

            db.onupgradeneeded = (e) => {
                const target = e.target as IDBRequest;
                dbChat = target.result as IDBDatabase;

                // Crear los almacenes de objetos (stores)
                const userObjectStore = dbChat.createObjectStore('user', { keyPath: 'user', autoIncrement: true });
                userObjectStore.createIndex('id', 'id', { unique: true });
                userObjectStore.createIndex('name', 'name', { unique: false });
                userObjectStore.createIndex('email', 'email', { unique: true });
                userObjectStore.createIndex('imgUrl', 'imgUrl', { unique: false });

                const contactObjectStore = dbChat.createObjectStore('contact', { keyPath: 'id', autoIncrement: true });
                contactObjectStore.createIndex('id', 'id', { unique: true });
                contactObjectStore.createIndex('nameContact', 'nameContact', { unique: false });
                contactObjectStore.createIndex('toList', 'toList', { unique: false });
                contactObjectStore.createIndex('lastMessage', 'lastMessage', { unique: false });
                contactObjectStore.createIndex('online', 'online', { unique: false });
                contactObjectStore.createIndex('timeDisconnected', 'timeDisconnected', { unique: false });
                contactObjectStore.createIndex('leido', 'leido', { unique: false });
                contactObjectStore.createIndex('userId', 'userId', { unique: false });
                contactObjectStore.createIndex('imgUrl', 'imgUrl', { unique: false });

                const mensajesObjectStore = dbChat.createObjectStore('mensajes', { keyPath: 'mensajes', autoIncrement: true });
                mensajesObjectStore.createIndex('id', 'id', { unique: true });
                mensajesObjectStore.createIndex('message', 'message', { unique: false });
                mensajesObjectStore.createIndex('send', 'send', { unique: false });
                mensajesObjectStore.createIndex('leido', 'leido', { unique: false });
                mensajesObjectStore.createIndex('time', 'time', { unique: false });
                mensajesObjectStore.createIndex('contactId', 'contactId', { unique: false });
            };
        });
    };

    // Funcion para crear el perfil del usuario nuevo
    static createUserProfile = async (user: User) => {
        //await dataUser.createDataBase();

        return new Promise<string>((resolve, reject) => {

            const transaccion = dbChat.transaction(['user'], "readwrite");

            transaccion.oncomplete = () => {
                //console.log("Transaccion completada");
            };

            transaccion.onerror = () => {
                console.error("Error al crear la transaccion");
            };

            const usuariObjectStore = transaccion.objectStore('user');

            const request = usuariObjectStore.add(user);


            request.onsuccess = () => {
                //console.log("Usuario creado");
                resolve("Usuario creado");
            }

            request.onerror = () => {
                console.error("Error al registrar los datos del usuario");
                reject("Error al obtener los datos del usuario");
            }
        });
    };

    // Función para actualizar el nombre del contacto
    static editUser = async (userId: User['id'], name?: User['id'], imgUrl?: User['imgUrl']) => {
        return new Promise<string>((resolve, reject) => {
            try{
                // Transaccion
                const transaccion = dbChat.transaction(["user"], "readwrite");

                // ObjectStore
                const userObjectStore = transaccion.objectStore("user");

                // Indice
                const index = userObjectStore.index("id");

                // Obtener el usuario
                const request = index.get(userId);

                request.onerror = () => {
                    reject("Error al buscar el usuario");
                };

                request.onsuccess = () =>{

                    //console.log(userId, name);

                    const user = request.result as User;

                    if( name ) user.name = name;
                    if( imgUrl ) user.imgUrl = imgUrl;
                    
                    const updateRequest = userObjectStore.put(user);

                    updateRequest.onerror = () => {
                        console.error("Error al actualizar el registro");
                        reject("Error al actualizar el registro");
                    };

                    updateRequest.onsuccess = () => {
                        //console.log("Contacto actualizado");
                        resolve("Nombre de usuario actualizado");
                    }; 

                };



            }
            catch(error){
                console.error(error);
            }
        })
    }

    // Función para cargar el perfil del usuario
    static loadUserProfile = async (userId: string) => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<User[]>((resolve, reject) => {

            const transaccion = dbChat.transaction(['user'], "readonly");

            transaccion.oncomplete = () => {
                //console.log("Transaccion completada");
            };

            transaccion.onerror = (e) => {
                //console.error("Error al crear la transaccion");
                console.log(e);
            };

            const usuariObjectStore = transaccion.objectStore('user');

            const index = usuariObjectStore.index("id");
            const cursorRequest = index.openCursor(userId);

            // Definir un arreglo vacio para los datos
            const result: User[] = [];

            cursorRequest.onerror = () => {
                console.error("Error al cargar los datos del usuario");
                reject("Error al cargar los datos del usuario");
            }

            cursorRequest.onsuccess = (e) => {
                const request = e.target as IDBRequest;
                const cursor = request.result as IDBCursorWithValue;

                if( cursor ){
                    result.push(cursor.value);
                    cursor.continue();
                }
                else{
                    resolve(result);
                };
            }
        });
    };

    // Función para cargar la lista de contactos
    static loadContactList = async (userId: User['id']) => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<Contact[]>((resolve, reject) => {
            const transaccion = dbChat.transaction(['contact'], "readonly");
            const result: Contact[] = []

            transaccion.onerror = () => {
                console.error("Error al cargar la lista de contactos");
                reject("Error al cargar la lista de contactos");
            };

            transaccion.oncomplete = () => {
                //console.log("Transaccion lista de contactos completada");
            };

            const contactObjectStore = transaccion.objectStore('contact');            
            //const request = contactObjectStore.getAll();

            const index = contactObjectStore.index("userId");
            const cursorRequest = index.openCursor(userId);

            cursorRequest.onerror = () => {
                console.error("Error al solicitar el contacto");
                reject("Error al solicitar el contacto")
            }

            cursorRequest.onsuccess = (e) => {
                const request = e.target as IDBRequest;
                const cursor = request.result as IDBCursorWithValue;

                if( cursor ){
                    result.push(cursor.value);
                    cursor.continue();
                }
                else{
                    resolve(result);
                };                
            }

            /*
            request.onerror = () => {
                console.log("Error al solicitar el contacto");
                reject("Error al solicitar el contacto");
            };

            request.onsuccess = (e) => {
                const request = e.target as IDBRequest;
                const result = request.result as Contact[];
                resolve(result);
            };
            */
        });
    };



    // Función para obtener el total de mensajes de un contacto específico
    static loadTotalMessages = async (contactId: Contact['id']): Promise<number> => {
        //await dataUser.createDataBase();

        return new Promise((resolve, reject) => {
            const transaccion = dbChat.transaction(['mensajes'], 'readonly');

            transaccion.onerror = () => {
                console.error("Error al crear la transacción");
                reject("Error al obtener el total de mensajes");
            };

            const messageObjectStore = transaccion.objectStore('mensajes');
            const index = messageObjectStore.index('contactId');  // Suponiendo que tienes un índice de 'contactId'

            // Usamos 'count()' para obtener el total de registros que coinciden con el 'contactId'
            const request = index.count(IDBKeyRange.only(contactId));  // Usamos IDBKeyRange.only para filtrar por 'contactId'

            request.onsuccess = (e) => {
                if( e.target && "result" in e.target ){
                    const total = e.target.result as number;
                    resolve(total);
                }
            };

            request.onerror = () => {
                console.error("Error al obtener el total de mensajes");
                reject("Error al obtener el total de mensajes");
            };
        });
    };




    // Función para cargar los mensajes
    static loadInitMessages = async (contactId: Contact['id']): Promise<Message[]> => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<Message[]>((resolve, reject) => {
            const transaccion = dbChat.transaction(['mensajes'], "readonly");

            transaccion.onerror = () => {
                console.error("Error al cargar la lista de mensajes");
                reject(new Error("Error al cargar la lista de mensajes"));
            };

            const messageObjectStore = transaccion.objectStore('mensajes');
            const index = messageObjectStore.index("contactId");
            const request = index.openCursor(contactId, "prev");

            const result: Message[] = [];
            const hasta = RESULTS_PER_PAGE;
            let indexCount = 0; // Contador de los mensajes procesados

            request.onerror = () => {
                console.error("Error al solicitar el contacto");
                reject(new Error("Error al solicitar el contacto"));
            };

            request.onsuccess = (e) => {
                const target = e.target as IDBRequest;
                const cursor = target.result as IDBCursorWithValue;

                if (cursor) {
                    if (indexCount < hasta) {
                        result.push(cursor.value as Message);
                    }
                    indexCount++;
                    if (indexCount < hasta) {
                        cursor.continue();
                    } else {
                        resolve(result.reverse());
                    }
                } else {
                    resolve(result.reverse());
                }
            };
        });
    };

    
    // Función para cargar los mensajes
    static loadPageMessages = async (contactId: Contact['id'], pagina = 0): Promise<Message[]> => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<Message[]>((resolve, reject) => {
            const transaccion = dbChat.transaction(['mensajes'], "readonly");

            transaccion.onerror = () => {
                console.error("Error al cargar la lista de mensajes");
                reject(new Error("Error al cargar la lista de mensajes"));
            };

            const messageObjectStore = transaccion.objectStore('mensajes');
            const index = messageObjectStore.index("contactId");
            const request = index.openCursor(contactId, "prev");

            const result: Message[] = [];
            const desde = RESULTS_PER_PAGE * pagina;
            const hasta = desde + RESULTS_PER_PAGE;
            let indexCount = 0; // Contador de los mensajes procesados

            request.onerror = () => {
                console.error("Error al solicitar el contacto");
                reject(new Error("Error al solicitar el contacto"));
            };

            request.onsuccess = (e) => {
                const target = e.target as IDBRequest;
                const cursor = target.result as IDBCursorWithValue;

                if (cursor) {
                    if (indexCount >= desde && indexCount < hasta) {
                        result.push(cursor.value as Message);
                    }
                    indexCount++;
                    if (indexCount < hasta) {
                        cursor.continue();
                    } else {
                        resolve(result.reverse());
                    }
                } else {
                    resolve(result.reverse());
                }
            };
        });
    };
    

    // Función para agregar un nuevo contacto
    static addContact = async (contact: Contact) => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<string>((resolve, reject) => {
            const transaccion = dbChat.transaction(['contact'], "readwrite");

            transaccion.onerror = () => {
                console.error("Error al crear la transaccion addContact");
                reject("Error al crear la transaccion");
            };

            const contactObjectStore = transaccion.objectStore('contact');
            const request = contactObjectStore.add(contact);

            request.onerror = (e) => {
                console.error("Error al agregar los datos");
                const target = e.target as IDBRequest;
                if( target.error && target.error.message.includes("uniqueness requirements")){
                    reject("Este contacto ya existe en tu lista de contactos");
                    return;
                }
                reject("Error al agregar los datos");
            };

            request.onsuccess = () => {
                //console.log("Datos agregados correctamente");
                resolve("Contacto agregado");
            };
        });
    };

    // Funcion para actualizar las propiedades, estado, leido y lastmessage del contacto
    static updateContact = async (contactData: { userId: string, status?: boolean, mensaje?: string, leido?: boolean, nameContact?: string, imgUrl?: string }) => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<string>((resolve, reject) => {
            const transaccion = dbChat.transaction(['contact'], 'readwrite');

            transaccion.onerror = (e) => {
                console.error(e);
                reject("Error al crear la transaccion para actualiza contacto");
            };

            // Primero se busca el contacto
            const contactoObjectStore = transaccion.objectStore('contact');
            const index = contactoObjectStore.index("id");
            const request = index.get(contactData.userId);

            request.onerror = (e) => {
                const target = e.target as IDBRequest;
                console.error("Error al solicitar el indice actualizar el contacto: ", target.error);
                resolve("Error al solicitar el indice para actualizar el contacto");
            };

            // Si existe el registro actualizalo
            request.onsuccess = () => {
                const registro: Contact = request.result;
                if(registro){

                    if( contactData.status ) registro.online = contactData.status;
                    if( contactData.mensaje ) registro.lastMessage = contactData.mensaje;
                    if( typeof contactData.leido === "boolean" ) registro.leido = contactData.leido;
                    if( contactData.nameContact ) registro.nameContact = contactData.nameContact;
                    if( contactData.imgUrl ) registro.imgUrl = contactData.imgUrl;

                    
                    const updateRequest = contactoObjectStore.put(registro);

                    updateRequest.onerror = () => {
                        console.error("Error al actualizar el registro");
                        reject("Error al actualizar el registro");
                    };

                    updateRequest.onsuccess = () => {
                        //console.log("Contacto actualizado");
                        resolve("Contacto actualizado");
                    };  
                }
                else{
                    resolve("Contacto no encontrado para actualizar");
                }
            };
        });
    }

    // Función para agregar un nuevo mensaje
    static addNewMessage = async (mensaje: Message) => {
        //await dataUser.createDataBase(); // Esperar que la base de datos esté lista

        return new Promise<string>((resolve, reject) => {
            const transaccion = dbChat.transaction(['mensajes'], "readwrite");

            transaccion.onerror = () => {
                console.error("Error al crear la transacción para mensajes");
                reject("Error al crear la transacción");
            };

            const mensajesObjectStore = transaccion.objectStore('mensajes');
            const request = mensajesObjectStore.add(mensaje);

            request.onerror = () => {
                console.error("Error al agregar el mensaje nuevo");
                reject("Error al agregar el mensaje nuevo");
            };

            request.onsuccess = () => {
                resolve("Mensaje agregado");
            };
        });
    };


    // Respada toda la BD
    static respaldarBD = async () => {
        return new Promise<BDData>(async (resolve, reject) => {

            const dbBackup: BDData = {
                user: {
                    id: "",
                    name: "",
                    email: ""
                },
                mensajes: [],
                contact: []
            };

            // Crear la transaccion para interactuar con los stores
            const transaccion = dbChat.transaction(['user', 'mensajes', 'contact'], "readonly");

            transaccion.onerror = () => {
                console.error("Error al crear la transaccion backup");
                reject("Error al crear la transacción en Backup");
            }

            // obtener los stores
            const userObjectStore = transaccion.objectStore("user");
            const mensajesObjectStore = transaccion.objectStore("mensajes");
            const contactosObjectStore = transaccion.objectStore("contact");

            // Crear los cursores para iterar po cada resultado
            const cursorUser = userObjectStore.openCursor();
            const cursorMensajes = mensajesObjectStore.openCursor();
            const cursorContactos = contactosObjectStore.openCursor();

            // Atrapa los errores que pudieran presentarse
            cursorUser.onerror = () => {
                console.error("Error al abrir el cursor de usuario");
                reject("Error al abrir el cursor de usuario");
            };

            cursorMensajes.onerror = () => {
                console.error("Error al abrir el cursor de mensajes");
                reject("Error al abrir el cursor de mensajes");
            };

            cursorContactos.onerror = () => {
                console.error("Error al abrir el cursor de contactos");
                reject("Error al abrir el cursor de contactos");
            };

            // Obtener los resultados de cada store
            const obtenerUsuario = new Promise<string>((resolve, reject) => {
                cursorUser.onsuccess = (e) => {
                    const target = e.target as IDBRequest;
                    const cursor = target.result as IDBCursorWithValue;
                    
                    try{
                        if( cursor ){
                            dbBackup.user = { ...cursor.value };
                            cursor.continue();
                        }
                        else{
                            resolve("Usuario obtenido");
                        }
                    }
                    catch(error){
                        reject(error);
                    }
                };
            })

            const obtenerMensajes =  new Promise<string>((resolve, reject) => {
                cursorMensajes.onsuccess = (e) => {
                    const target = e.target as IDBRequest;
                    const cursor = target.result as IDBCursorWithValue;
    
                    try{
                        if( cursor ){
                            dbBackup.mensajes.push({ ...cursor.value });
                            cursor.continue();
                        }
                        else{
                            resolve("Mensajes obtenidos")
                        }
                    }
                    catch(error){
                        reject(error);
                    }
                };
            });

            const obtenerContactos = new Promise<string>((resolve, reject) => {
                cursorContactos.onsuccess = (e) => {
                    const target = e.target as IDBRequest;
                    const cursor = target.result as IDBCursorWithValue;
    
                    try{
                        if( cursor ){
                            dbBackup.contact.push({ ...cursor.value });
                            cursor.continue();
                        }
                        else{
                            resolve("Contacto obtenidos");
                        }
                    }
                    catch(error){
                        reject(error);
                    }
                }
            });

            await Promise.all([obtenerUsuario, obtenerContactos, obtenerMensajes]);
            resolve(dbBackup);
        });
    };

    static clearDB = async () => {
        return new Promise<string>((resolve, reject) => {
            try{
                const transaccion = dbChat.transaction(['mensajes', 'contact'], "readwrite");
                const mensajesObjectStore = transaccion.objectStore("mensajes");
                const contactObjectStore = transaccion.objectStore("contact");

                const requestMensajes = mensajesObjectStore.clear();
                const requestContactos = contactObjectStore.clear();

                requestMensajes.onerror = () => {
                    console.error("Error al limpiar los mensajes");
                    reject("Error al limpiar los mensajes");
                };

                requestMensajes.onsuccess = () => {
                    resolve("Mensajes limpiados");    
                };
                
                requestContactos.onerror = () => {
                    console.error("Error al limpiar los contacto");
                    reject("Error al limpiar los contactos");
                };

                requestContactos.onsuccess = () => {
                    resolve("Contactos limpiados");    
                };
                
            }
            catch(error){
                console.error(error);
                reject("Error al limpiar la BD");
            }
        });
    };

    static clearAllBD = async () => {
        return new Promise<string>(async (resolve, reject) => {
            try{
                const transaccion = dbChat.transaction(["mensajes", "contact", "user"], "readwrite");
                const mensajesObjectStore = transaccion.objectStore("mensajes");
                const contactObjectStore = transaccion.objectStore("contact");
                const userObjectStore = transaccion.objectStore("user");

                const requestMensajes = mensajesObjectStore.clear();
                const requestContactos = contactObjectStore.clear();
                const requestUser = userObjectStore.clear();

                requestMensajes.onerror = () => {
                    console.error("Error al limpiar los mensajes");
                    reject("Error al limpiar los mensajes");
                };

                requestContactos.onerror = () => {
                    console.error("Error al limpiar los contactos");
                    reject("Error al limpiar los contactos");
                };

                requestUser.onerror = () => {
                    console.error("Error al limpiar el usuario");
                    reject("Error al limpiar el usuario");
                };

                await Promise.all([
                    requestMensajes.onsuccess = () => { resolve("Mensajes limpiados"); },
                    requestContactos.onsuccess = () => { resolve("Contactos limpiados"); },
                    requestUser.onsuccess = () => { resolve("Usuario limpiado"); }
                ]);

                resolve("BD limpiada por completo");
            }
            catch(error){
                console.error(error);
            }   reject("Error al eliminar la BD");
        })
    }
}
