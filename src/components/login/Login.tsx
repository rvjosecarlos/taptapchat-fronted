import Spinner from "../Spinner";
import { appZustandStore } from "../../store";
import { useState } from "react";
import { login, requestNewToken } from "../../api/authAPI";
import { ServerResponse } from "../../types";
import SendResetEmail from "../ResetPassword/SendResetEmail";
import { dataUser } from "../../config/dataUser";
import { loadDataUser } from "../../api/userAPI";
import { insertDataImport } from "../../services/backupProcess/backupProcess";
import Logo from "../Logo";

export default function Login(){
    
    const setUserProfile = appZustandStore.useUserStore( state => state.setUserProfile );
    const setNewUser = appZustandStore.useUserStore( state => state.setNewUser );
    const resetPassword = appZustandStore.useUserStore( state => state.resetPassword );
    const setResetPassword = appZustandStore.useUserStore( state => state.setResetPassword );
    
    const [dataLogin, setDataLogin] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);

    const handleSubmit = async () => {
        
        if( Object.values(dataLogin).includes("") ){
            setError("Por favor, escribe tu correo y tu contraseña");
            return;
        };

        if( !new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]/g).test(dataLogin.email) ){
            setError("Correo electrónico no válido");
            return;
        };

        setSpinner(true);

        // Autenticarse
        const res: ServerResponse = await login(dataLogin);
        if( !res.success && res.errors){
            setSpinner(false);
            if( res.errors[0].msg === "Usuario no confirmado" ){
                const resNewToken: ServerResponse = await requestNewToken( dataLogin.email );
                if( resNewToken.success ){
                    setError(res.errors[0].msg + ". Se ha enviado un nuevo token a tu cuenta de correo");
                }
                else{
                    setError(res.errors[0].msg + ". Se intento enviar un nuevo token pero hubo un error");
                }
            }
            else{
                setError(res.errors[0].msg);
            }
            return;
        }

        // Obtener los datos del usuario si ya ha sido autenticado
        const result: ServerResponse = await loadDataUser();
        try{
            if( result.data && typeof result.data === "object" ){
                // Cargar el usuario logueado intenta obtenerlo desde backup o indexedDB 
                // y si no crear un nuevo usuario en la indexedDB
                await insertDataImport(result.data.id);

                let usuario = await dataUser.loadUserProfile(result.data.id);
                if( usuario.length <= 0 ){
                    await dataUser.createUserProfile(result.data);
                    usuario = await dataUser.loadUserProfile(result.data.id);
                }

                setUserProfile(usuario[0]);
            }
            else{
                setError(result.errors![0].msg);
                setSpinner(false);
                setUserProfile(null);
            }
        }
        catch(error){
            console.error(error);
            setError("Error");
            setSpinner(false);
        };        
    };

    const handleClick = () => {
        setNewUser(true);
    }

    const handleResetPassword = () => {
        setResetPassword(true);
    }

    if(!resetPassword) return(
        <div className="h-screen flex flex-col justify-center items-center imagen-bg">
            <Logo className="h-32 -mb-7"/>
            <form 
                className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl"
                onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        handleSubmit();
                    }
                }}
            >
                <p className="font-semibold text-center">TapTap Chat</p>
                <input 
                    type="email" 
                    placeholder="Correo electrónico"
                    value={dataLogin.email.toLowerCase()}
                    onChange={(e) => {
                        setDataLogin( state => ({ ...state, email: e.target.value }))
                        setError("");                       
                    }}
                    className="p-3 border border-slate-200 rounded"
                />
                <input 
                    type="password" 
                    placeholder="Contraseña"
                    value={dataLogin.password}
                    onChange={(e) => {
                        setDataLogin( state => ({ ...state, password: e.target.value }));
                        setError(""); 
                    }}
                    className="p-3 border border-slate-200 rounded"  
                />
                {
                    spinner ?
                        <div className="flex flex-col justify-center items-center gap-2">
                            <Spinner/>
                            <p>Iniciando sesión...</p>
                        </div>
                    :
                        <input 
                            aria-label="Iniciar sesión"
                            type="button" 
                            value="Iniciar sesión" 
                            onClick={handleSubmit}
                            className="w-full bg-black text-slate-50 p-3 rounded cursor-pointer hover:bg-slate-800"
                        />
                }
                <div className="flex flex-col">
                    {
                        error && <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
                    }
                    {
                        error === "Correo electrónico o contraseña incorrectos" && 
                        <p 
                            className="text-center text-sm font-semibold text-indigo-800 hover:text-indigo-500 cursor-pointer"
                            onClick={handleResetPassword}
                        >
                            Recuperar contraseña
                        </p>
                    }
                </div>
                <p className="text-center text-sm">
                    ¿No tienes cuenta?. {" "}
                    <span 
                        className="font-semibold text-indigo-800 hover:text-indigo-500 cursor-pointer"
                        onClick={handleClick}
                    >
                        Regístrate
                    </span>
                </p>
            </form>
        </div>
    )

    if(resetPassword) return( <SendResetEmail/> )
}