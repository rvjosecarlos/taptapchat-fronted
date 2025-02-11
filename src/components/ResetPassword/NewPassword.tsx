import { useState } from "react";
import Spinner from "../Spinner";
import { changePassword } from "../../api/authAPI";
import { ServerResponse } from "../../types";
import { appZustandStore } from "../../store";

export default function NewPassword(){
    const { setResetPassword } = appZustandStore.useUserStore( state => state );
    const [token, setToken] = useState("");
    const [password, setPassword] = useState({ password: "", passwordConfirm: ""});
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleClick = async () => {
        if( Object.values(password).includes("") || !token ){
            setError("Todos los campos son obligatorios");
            return;
        };

        if( password.password !== password.passwordConfirm ){
            setError("Las contraseñas no coinciden");
            return;
        };

        if( password.password.length < 8 ){
            setError("La contraseña debe tener mínimo 8 caracteres");
            return;
        };

        setSpinner(true);
        const res: ServerResponse = await changePassword({ ...password, token });
        setSpinner(false);
        if(!res.success){
            res.errors ? setError(res.errors[0].msg) : setError("Error al realizar la solicitud");
            return;
        }        
        setEnviado(true);
    };

    const handleClickReturn = () => {
        window.location.reload();
    };
            
    if(!enviado) return(
        <div className="h-screen flex justify-center items-center imagen-bg">
            <form 
                className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl"
                onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                <p className="font-semibold text-center">Recuperar contraseña TapTap Chat</p>
                <p className="text-sm">Escribe el código de verificación enviado a tu cuenta de correo electrónico y crea tu nueva contraseña.</p>
                <input 
                    type="text" 
                    maxLength={6}
                    value={token}
                    placeholder="Código de verificación"
                    onChange={(e) => {
                        setToken(e.target.value);
                        setError("");
                    }}
                    className="p-3 border border-slate-200 rounded text-center"
                />
                <input 
                    type="password" 
                    value={password.password}
                    placeholder="Nueva contraseña *"
                    onChange={(e) => {
                        setPassword( state => ({ ...state, password: e.target.value }));
                        setError("");
                    }}
                    className="p-3 border border-slate-200 rounded"
                />
                <input 
                    type="password" 
                    value={password.passwordConfirm}
                    placeholder="Confirmar nueva contraseña *"
                    onChange={(e) => {
                        setPassword( state => ({ ...state, passwordConfirm: e.target.value }));
                        setError("");
                    }}
                    className="p-3 border border-slate-200 rounded"
                />
                    {
                        error && <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
                    }
                    {
                        spinner ?
                            <Spinner/>
                        :
                            <div className="flex gap-3">
                                <input 
                                    type="button" 
                                    value={"Aceptar"}
                                    onClick={handleClick}
                                    className={ "w-full bg-black text-slate-50 p-3 rounded cursor-pointer hover:bg-slate-800"}
                                />
                                <input 
                                    type="button" 
                                    value={"Cancelar"}
                                    onClick={() => setResetPassword(false)}
                                    className="w-full border-black border p-3 rounded cursor-pointer hover:bg-slate-300"
                                />
                            </div>
                        }
                       
            </form>
        </div>
    )

    if(enviado) return (
        <div className="h-screen flex justify-center items-center imagen-bg">
            <form className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl">
                <p className="font-semibold text-center">Recuperar contraseña TapTap Chat</p>
                <p className="text-sm">Contraseña reestablecida</p>
                <div>
                    <p
                        onClick={handleClickReturn}
                        className="p-2 text-center font-bold text-indigo-800 hover:text-indigo-500 cursor-pointer underline"
                    >
                        Iniciar sesión
                    </p>
                </div>  
            </form>
        </div>
    )
}