import { useState } from "react";
import Spinner from "../Spinner";
import { appZustandStore } from "../../store";
import NewPassword from "./NewPassword";
import { ServerResponse } from "../../types";
import { requestNewToken } from "../../api/authAPI";


export default function SendResetEmail(){
    const {emailReset, setEmailReset, setResetPassword} = appZustandStore.useUserStore( state => state );
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleClick = async () => {
        if( !emailReset || !new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/g).test(emailReset) ){
            setError("Correo electrónico no válido");
            return;
        }

        setSpinner(true);
        console.log("Enviando nuevo token");
        const res: ServerResponse = await requestNewToken(emailReset);
        setSpinner(false);

        if( !res.success ){

            res.errors ? setError(res.errors[0].msg) : setError("Error al realizar la solicitud");
            return;
        }
        setEnviado(true);
    }

    if(!enviado) return(
        <div className="h-screen flex justify-center items-center">
            <form 
                className="flex flex-col gap-5 w-80 m-5 border border-slate-200 p-3 rounded shadow-2xl"
                onKeyDown={(e) => {
                    if(e.key === "Enter"){
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                <p className="font-semibold text-center">Recuperar contraseña TapTap Chat</p>
                <p className="text-sm">Escribe tu correo electrónico</p>
                <input 
                    key={"inputEmail"}
                    type="email" 
                    value={emailReset}
                    onChange={(e) => {
                        setEmailReset(e.target.value);
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

    if(enviado) return ( <NewPassword/> )
}