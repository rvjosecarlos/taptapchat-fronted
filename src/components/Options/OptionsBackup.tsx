import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { appZustandStore } from "../../store";
import { useState } from "react";
import Spinner from "../Spinner";
import { createBackup, insertDataImport } from "../../services/backupProcess/backupProcess";

export default function OptionsBackup(){
    const [ spinner, setSpinner ] = useState(false);
    const [ error, setError ] = useState("");
    const [ processOk, setProcessOk ] = useState(false);
    const [ importProcess, setImportProcess ] = useState(false);
    const { userProfile } = appZustandStore.useUserStore( state => state );
    const { showBackupView, setShowBackupView } = appZustandStore.useModalStore(state => state);
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleClickInit = () => {
        setShowBackupView(false);
        setTimeout(()=>{
            setSpinner(false);
            setError("");
            setProcessOk(false);
        },500);
        if( processOk && importProcess ){
            setImportProcess(false);            
            location.reload();
        };
    };

    const handleCrearBackup = async () => {
        console.log("respaldando");
        setSpinner(true);
        const res = await createBackup();
        if( !res.success && res.errors ){
            setError(JSON.stringify(res.errors[0].msg));
        }
        else{
            console.log(res.message);
            setProcessOk(true);           
        }
        setSpinner(false);
    };

    const handleImportBackup = async () => {
        console.log("Importando");
        setSpinner(true);
        setImportProcess(true);
        const res = await insertDataImport(userProfile!.id);
        if( !res.success && res.errors ){
            setError(JSON.stringify(res.errors[0].msg));
        }
        else{
            console.log(res.message);
            setProcessOk(true);
        }
        setSpinner(false);
    };

    return(
        <Dialog open={showBackupView} as="div" className="relative z-40 focus:outline-none" onClose={() => setShowBackupView(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-300/50">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                      transition
                      className={`${ darkMode ? "bg-[#121212] text-white" : "bg-white" } shadow-2xl w-full max-w-md rounded-xl p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0`}
                    >
                        <div className="flex items-center">
                            <div
                                className="cursor-pointer w-10 h-10 flex justify-center items-center gap-2 rounded-full active:scale-150 transition-all duration-75 active:bg-slate-200"
                                onClick={handleClickInit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                            <DialogTitle as="h3" className="text-base/7 font-semibold">
                                Copia de seguridad
                            </DialogTitle>
                        </div>
                        <p className="my-5">
                            Crea una copia de seguridad para respaldar tu información de usuario, incluidos 
                            tus contactos y mensajes. Esto te permitirá iniciar sesión en otro dispositivo 
                            e importar tus conversaciones y contactos. De manera predeterminada la aplicación crea 
                            una copia de seguridad al cerrar sesión e importa tu copia cada vez que inicias sesión despues
                            de haberla cerrado.
                        </p>
                        <p className="text-red-700 font-semibold mb-5">Importante: </p> 
                            
                        <p className="mb-5">
                            La aplicación solo permite una sesión activa a la vez, por lo que si inicias 
                            sesión en otro dispositivo, se cerrará automáticamente en el anterior.
                        </p>
                        <p className="mb-5">
                            Si inicias sesión en un nuevo dispositivo sin haber creado una copia de seguridad 
                            previamente ó haber cerrado sesión, no podrás recuperar tus contactos ni mensajes.
                        </p>                        
                        {
                            processOk && <p className="text-lime-700 font-semibold text-center">Proceso completado</p>
                        }
                        {
                            spinner ? 
                                <Spinner />
                            :
                            <div className="space-y-5">
                                
                                <div className="flex justify-between items-center">
                                    {
                                        !processOk && !error ?
                                        <>
                                            <Button
                                                aria-label="Importar copia de seguridad"
                                                className="text-white inline-flex items-center gap-2 rounded-md bg-black border hover:bg-gray-600 py-1.5 px-1 text-sm/6 font-semibold"       
                                                onClick={ handleImportBackup }
                                            >
                                                { "Importar copia de seguridad" }
                                            </Button>
                                            <p className="px-2"> ó </p>
                                            <Button
                                                aria-label="Crear copia de seguridad"
                                                className="text-white inline-flex items-center gap-2 rounded-md bg-black border hover:bg-gray-600 py-1.5 px-3 text-sm/6 font-semibold"       
                                                onClick={ handleCrearBackup }
                                            >
                                                { "Crear copia de seguridad" }
                                            </Button>
                                        </>
                                        :
                                        error && <p className="text-red-700 font-semibold text-center">{error}</p>
                                    }
                                </div>
                                <Button
                                    className={`${ darkMode ? "text-black" : "" }  w-full flex justify-center items-center gap-2 rounded-md ${ processOk ? "bg-black border hover:bg-gray-600 text-white" : "bg-white border border-black hover:bg-slate-200" } py-1.5 px-3 text-sm/6 font-semibold`}       
                                    onClick={handleClickInit}
                                >
                                    { processOk ? "Aceptar" : "Cancelar" }
                                </Button>
                            </div>
                        }
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}