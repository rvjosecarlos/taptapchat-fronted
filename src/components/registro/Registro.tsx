import { useState } from "react"
import { RegistroUser, ServerResponse } from "../../types";
import { appZustandStore } from "../../store";
import { confirmAccount, createAccount, requestNewToken } from "../../api/authAPI";
import Spinner from "../Spinner";
import ShowPassword from "./ShowPassword";

const nuevoUsuario = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: ""
};

type RegistroProps = {
    tokenParam?: string
}

export default function Registro({ tokenParam }: RegistroProps){
    const { setNewUser } = appZustandStore.useUserStore( state => state );
    const [registro, setRegistro] = useState( tokenParam ? true : false );
    const [dataUsuario, setDataUsuario] = useState<RegistroUser>(nuevoUsuario);
    const [error, setError] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [hiddenAceptar, setHiddenAceptar] = useState(false);
    const [token, setToken] = useState( tokenParam ? tokenParam : "");
    const [ showPass, setShowPass ] = useState( false );

    const handleSubmit = async () => {

        const { email, password, passwordConfirm } = dataUsuario;
        if( Object.values(dataUsuario).includes("") ){
            setError("Todos los campos son obligatorios");
            return;
        };

        if( !new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/g).test(email) ){
            setError("Correo electrónico no válido");
            return;
        };

        if( password !== passwordConfirm ){
            setError("Las contraseñas no coinciden");
            return;
        };

        setSpinner(true);
        const res: ServerResponse = await createAccount(dataUsuario);
        setSpinner(false);
        
        if( !res.success && res.errors){
            if( res.errors[0].msg === "Usuario sin confirmar" ){
                const resRequestToken: ServerResponse = await requestNewToken( dataUsuario.email );
                if( resRequestToken.success ){
                    setError("La cuenta ya esta registrada, hemos enviado un nuevo token para que confirmes tu cuenta");
                }
                else{
                    setError("Error: Cuenta ya registrada, no se pudo enviar un nuevo token de confirmación");
                }                
            }
            else{
                setError(res.errors[0].msg);
            }
            return;
        };

        setDataUsuario(nuevoUsuario);
        setRegistro(true);  
    };

    const handleClick = async () => {
        setSpinner(true);
        setHiddenAceptar(true);
        const res: ServerResponse = await confirmAccount(token);
        setSpinner(false);
        if(!res.success && res.errors){
            setError(res.errors[0].msg);
            setHiddenAceptar(false);
            return;
        };
    };

    /*
    const handleConfirmToken = () => {
        setRegistro(true);
    }
    */

    if(!registro)return (
        <div className="h-screen flex justify-center items-center imagen-bg">
            <form className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl">
                <p className="font-semibold text-center">Registro en TapTap Chat</p>
                <input 
                    key={"userName"}
                    type="text" 
                    placeholder="Nombre de usuario *"
                    className="p-3 border border-slate-200 rounded"
                    value={dataUsuario.name}
                    onChange={(e) => {
                        setDataUsuario( (state) => ({ ...state, name: e.target.value }) );
                        setError("");
                    }}
                />
                <input

                    type="email" 
                    placeholder="Correo electrónico *"
                    className="p-3 border border-slate-200 rounded"
                    value={dataUsuario.email.toLowerCase()}
                    onChange={(e) => {
                        setDataUsuario( (state) => ({...state, email: e.target.value }) );
                        setError("");
                    }}
                />
                <div className="flex justify-between items-center">
                    <input 
                        type={ showPass ? "text" : "password" } 
                        placeholder="Contraseña *"
                        className="p-3 border border-slate-200 rounded w-full" 
                        value={dataUsuario.password}
                        onChange={(e) => {
                            setDataUsuario((state) => ({...state, password: e.target.value}) );
                            setError("");
                        }} 
                    />
                    <ShowPassword 
                        setShowPass={setShowPass}
                        showPass={showPass}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <input 
                        type={ showPass ? "text" : "password" } 
                        placeholder="Confirmar contraseña *"
                        className="p-3 border border-slate-200 rounded w-full" 
                        value={dataUsuario.passwordConfirm}
                        onChange={(e) => {
                            setDataUsuario((state) => ({...state, passwordConfirm: e.target.value}) );
                            setError("");
                        }} 
                    />
                    <ShowPassword 
                        setShowPass={setShowPass}
                        showPass={showPass}
                    />
                </div>
                {
                    spinner ?
                        <Spinner/>
                    :
                        <div className="flex gap-3">
                            <input 
                                type="button" 
                                value="Registrarse" 
                                onClick={handleSubmit}
                                className="w-full bg-black text-slate-50 p-3 rounded cursor-pointer hover:bg-slate-800"
                            /> 
                            <input 
                                type="button" 
                                value="Cancelar" 
                                onClick={() => setNewUser(false)}
                                className="w-full border-black border p-3 rounded cursor-pointer hover:bg-slate-300"
                            />
                        </div>
                } 
                {
                    error && <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
                } 
                {
                    /*
                    <p className="text-sm text-center">¿Ya hiciste el registro?. {' '}
                        <span 
                            className="font-semibold text-indigo-800 hover:text-indigo-500 cursor-pointer"
                            onClick={handleConfirmToken}
                        >
                            Confirma tu cuenta
                        </span>
                    </p>
                    */
                }             
            </form>
        </div>
    )

    return (
        <div className="h-screen flex justify-center items-center imagen-bg">
            <form className="flex flex-col gap-5 w-80 m-5 bg-white border border-slate-200 p-3 rounded shadow-2xl">
                <p className="font-semibold text-center">Registro en TapTap Chat</p>
                <p className="text-sm">
                    {
                        hiddenAceptar ? "Inicia sesión y comienza a chatear con TapTap Chat" : "Introduce el código de verificación enviado a tu cuenta de correo electrónico."
                    }
                </p>
                {
                    hiddenAceptar ?
                        <label className="p-2 border text-center text-2xl font-bold">{token}</label>
                    :
                    <input 
                        key={"inputToken"}
                        type="text" 
                        maxLength={6}
                        value={token}
                        onChange={(e) => {
                            setToken(e.target.value);
                            setError("");
                        }}
                        className="p-2 border text-center text-2xl font-bold"
                    />
                }
                {
                    spinner ?
                        <Spinner/>
                    :
                        <input 
                            type="button" 
                            value={"Aceptar"}
                            onClick={handleClick}
                            className={ hiddenAceptar ? "hidden" : "w-full bg-black text-slate-50 p-3 rounded cursor-pointer hover:bg-slate-800"}
                        />
                }
                {
                    error ?
                        <div className="flex flex-col gap-2">
                            <p className="w-full text-center text-sm text-red-700 font-semibold">{error}</p>
                            {
                                /*
                                <p 
                                    className="text-center text-sm underline cursor-pointer"
                                    onClick={() => setNewUser(false)}
                                >
                                    Regresar
                                </p>                                
                                */
                            }
                        </div>
                    :
                        <div className={ !hiddenAceptar ? "hidden" : "" }>
                            <p
                                onClick={() => {
                                    location.href = location.origin;
                                }}
                                className="p-2 text-center font-bold text-indigo-800 hover:text-indigo-500 cursor-pointer underline"
                            >
                                Iniciar sesión
                            </p>
                            <p className="w-full mt-2 text-center text-sm font-semibold">Cuenta confirmada</p>
                        </div>      
                }
            </form>
        </div>
    )
};