import { useState } from "react";
import Spinner from "../Spinner";
import NewPassword from "./NewPassword";

export default function SendResetToken(){
    const [token, setToken] = useState("");
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleClick = async () => {
        if( !token ){
            setError("Código de verificación no válido");
            return;
        }

        setSpinner(true);
        setSpinner(false);
        setEnviado(true);
    }
            
    if(!enviado) return(
        <div className="h-screen flex justify-center items-center imagen-bg">
            <form className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl">
                <p className="font-semibold text-center">Recuperar contraseña TapTap Chat</p>
                <p className="text-sm">Introduce el código de verificación enviado a tu cuenta de correo electrónico.</p>
                <input 
                    type="text" 
                    maxLength={6}
                    value={token}
                    onChange={(e) => {
                        setToken(e.target.value);
                        setError("");
                    }}
                    className="p-3 border border-slate-200 rounded text-center"
                    />
                    {
                        error && <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
                    }
                    {
                        spinner ?
                            <Spinner/>
                        :
                            <input 
                                type="button" 
                                value={"Aceptar"}
                                onClick={handleClick}
                                className={ "w-full bg-black text-slate-50 p-3 rounded cursor-pointer hover:bg-slate-800"}
                            />
                        }
                       
            </form>
        </div>
    )

    if(enviado) return( <NewPassword/> )
}