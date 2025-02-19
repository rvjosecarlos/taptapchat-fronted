import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { dataUser } from "../../config/dataUser";
import { appZustandStore } from "../../store";
import { useState } from "react";
import Spinner from "../Spinner";
import { searchContact } from "../../api/userAPI";
import { ServerResponse } from "../../types";

export default function AddContactModal(){
    const userProfile = appZustandStore.useUserStore( state => state.userProfile );
    const contactos = appZustandStore.useContactListStore( state => state.contactos );
    const setContactos = appZustandStore.useContactListStore( state => state.setContactos );
    const setContactosFiltrados = appZustandStore.useContactListStore( state => state.setContactosFiltrados );
    const modalAddContact = appZustandStore.useModalStore( state => state.modalAddContact );
    const setModalAddContact = appZustandStore.useModalStore( state => state.setModalAddContact );
    
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);

    const handleClick = async () => {
        try{
            const addContact = dataUser.addContact;

            if( Object.values(email).includes("") ){
                setError("Por favor, escribe tu correo y tu contraseña");
                return;
            };
    
            if( !new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]/g).test(email) || email === userProfile?.email ){
                setError("Correo electrónico no válido");
                return;
            };

            setSpinner(true);
            const res: ServerResponse = await searchContact(email);
            if( !res.success && res.errors ){
                setError(res.errors[0].msg);
                setSpinner(false);
                return;
            };

            if( !userProfile || !res.data || typeof res.data !== "object" ){
                setError("Error de la app, no hay perfil de usuario o datos del servidor");
                setSpinner(false);
                return;
            };
    
    
            // Se prepara el nuevo contacto
            const newContact = {
                "id": res.data!.id,
                "nameContact": res.data.name,
                "emailContact": res.data.email,
                "toList": false,
                "lastMessage": "",
                "online": false, //res.data.online,
                "timeDisconnected": 0,
                "leido": false,
                "userId": userProfile.id,
                "imgUrl": res.data.imgUrl
            };

            // Valida que el contacto no se duplique
            const contactExist = contactos.find( contacto => {
                return typeof res.data === "object" && contacto.id === res.data!.id 
            });
            if( contactExist ){
                setError("El contacto ya existe en tu lista de contactos");
                setSpinner(false);
                return;
            };
    
            // Agregar el contacto a la BD local de indexedDB
            await addContact(newContact);
    
            // Renderiza el nuevo contacto
            setContactosFiltrados([...contactos, newContact]);
            setContactos([...contactos, newContact]);
            setModalAddContact(false);
            setSpinner(false);
            setEmail("");
        }
        catch(error){
            console.error(error);
            if( typeof error === "string" ){
                setError(error);
            };
            setSpinner(false);
        }
    }

    return(
        <>

      <Dialog open={modalAddContact} as="div" className="relative z-10 focus:outline-none" onClose={() => setModalAddContact(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-300/50">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="shadow-2xl w-full max-w-md rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-semibold">
                Agregar contacto
              </DialogTitle>
                <form 
                    className="my-5"
                    onKeyDown={(e) => {
                        if( e.key === "Enter" ){
                            e.preventDefault();
                            handleClick();
                        }
                    }}
                >
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    placeholder="Correo electrónico"
                    className="w-full p-2 border rounded"
                />
              </form>
              {
                    error && <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
              }
              {
                    spinner ?
                        <Spinner/>
                    :
                        <div className="mt-4 flex justify-between">
                            <Button
                                aria-label="Agregar contacto"
                                className="inline-flex items-center gap-2 rounded-md bg-black py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                onClick={handleClick}
                            >
                                Agregar
                            </Button>
                            <Button
                                aria-label="Cancelar"
                                className="inline-flex items-center gap-2 rounded-md bg-white border border-black hover:bg-slate-200 py-1.5 px-3 text-sm/6 font-semibold "
                                onClick={() => {
                                    setModalAddContact(false);
                                    setEmail("");
                                    setError("");
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
              }
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
    )
}