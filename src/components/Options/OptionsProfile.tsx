import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { appZustandStore } from "../../store";
import { useState } from "react";
import Spinner from "../Spinner";
import ProfileMainData from "../contactoInfo/ProfileMainData";
import { ServerResponse } from "../../types";
import { changePassword, requestNewToken } from "../../api/authAPI";
import { editUserName, uploadImage } from "../../api/userAPI";
import { dataUser } from "../../config/dataUser";

const dataProfile = {
    name: "",
    token: "",
    password: "",
    passwordConfirm: ""
}

const typeFiles = ["image/png", "image/jpeg", "image/webp"];

export default function OptionsProfile(){

    const [ userDataProfile, setUserDataProfile ] = useState(dataProfile);
    const [ error, setError ] = useState("");
    const [ errorDetail, setErrorDetail ] = useState("");
    const [ process, setProcess ] = useState("");
    const [ sendToken, setSendToken ] = useState(false);
    const [ processOk, setProcessOk ] = useState(false);
    const { showProfileView, setShowProfileView } = appZustandStore.useModalStore(state => state);
    const userProfileStore = appZustandStore.useUserStore( state => state.userProfile );
    const setUserProfileStore = appZustandStore.useUserStore( state => state.setUserProfile );
    const wscStore = appZustandStore.useSocketStore( state => state.wscStore );
    const contactos = appZustandStore.useContactListStore( state => state.contactos );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleEditName = async () => {
        setProcess("editname");

        if( !userDataProfile.name ){
            setError("editname");
            setErrorDetail("Escribe un nombre válido");
            setProcess("");
            return;
        };
        
        const expReg = new RegExp(/<[^<>]+>/g);
        if( expReg.test(userDataProfile.name) ){
            setError("editname");
            setErrorDetail("Escribe un nombre válido");
            setProcess("");
            return
        };

        // Aqui la logica para llamar a la api
        console.log(userDataProfile.name);
        const res: ServerResponse = await editUserName(userProfileStore!.id, userDataProfile.name );

        if( !res.success && res.errors ){
            setError("editname");
            setProcess("");
            setErrorDetail(res.errors[0].msg);
            return;
        };

        const result = await dataUser.editUser(userProfileStore!.id, userDataProfile.name);

        if( result !== "Nombre de usuario actualizado" ){
            setError("editname");
            setProcess("");
            setErrorDetail(result);
            return;
        };

        setUserProfileStore({ 
            id: userProfileStore!.id,
            name: userDataProfile.name,
            email: userProfileStore!.email,
            imgUrl: userProfileStore!.imgUrl
        });
        setProcessOk(true);

        wscStore!.send(JSON.stringify({
            type: "update-user",
            originUserId: userProfileStore!.id,
            destinationUserId: "",
            message: "",
            updateNameContact: userDataProfile.name,
            contacts: JSON.stringify(contactos.map( contacto => contacto.id))
        }));
    };

    const handleEditPass = async () => {
        setProcess("editpass");
        console.log(userDataProfile);
        if( !userDataProfile.token || !userDataProfile.password || !userDataProfile.passwordConfirm ){
            setError("editpass");
            setErrorDetail("Todos los campos son obligatorios");
            setProcess("");
            return;
        };

        if( userDataProfile.token.length > 6 || isNaN(Number(userDataProfile.token))){
            setError("editpass");
            setErrorDetail("Token no válido");
            setProcess("");
            return;
        };

        if( userDataProfile.password.length < 8 ){
            setError("editpass");
            setErrorDetail("La contraseña debe tener al menos 8 caracteres");
            setProcess("");
            return;
        };

        if( userDataProfile.password !== userDataProfile.passwordConfirm ){
            setError("editpass");
            setErrorDetail("Las contraseñas no son iguales");
            setProcess("");
            return;
        };

        // Se envian las contraseñas a la api
        const dataChangePassword = {
            token: userDataProfile.token,
            password: userDataProfile.password,
            passwordConfirm: userDataProfile.passwordConfirm
        }
        const res: ServerResponse = await changePassword(dataChangePassword);
        if( !res.success && res.errors ){
            console.log("Error al actualizar la contraseña");
            console.log(res);
            setError("editpass");
            setErrorDetail(res.errors[0].msg);
            setProcess("");
            return;
        };

        console.log("Contraseña actualizada");
        console.log(res);
        setProcessOk(true);
        setError("");
        setErrorDetail("");
        setUserDataProfile(dataProfile);
    };

    const handleSendToken = async () => {

        setProcess("sendtoken");

        const res: ServerResponse = await requestNewToken(userProfileStore!.email);

        if( !res.success && res.errors ){
            setError("sendtoken");
            setErrorDetail(/*res.errors[0].msg*/"Error al enviar el token");
            setProcess("");
            return;
        }
        setError("");
        setErrorDetail("");
        setProcess("");
        setSendToken(true);
        console.log("Enviando token");
    };

    const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setProcess("editfoto");
        setProcessOk(false);
        setError("");

        if( !e.target || !e.target.files ){
            console.log("No hay imagen seleccionada");
            setError("editfoto");
            setErrorDetail("Seleccione una imagen");
            setProcess("");
            return;
        };

        if( !typeFiles.includes(e.target.files[0].type) ){
            console.log("No es una imagen");
            setError("editfoto");
            setErrorDetail("Formato de imagen no válido");
            setProcess("");
            return;
        };

        if( e.target.files[0].size > 1048576 ){
            setError("editfoto");
            setErrorDetail("La imagen es demasiado grande");
            setProcess("");
            return;
        };

        console.log("Si es una imagen", e.target.files[0]);
        const formData = new FormData();
        formData.append("avatar",e.target.files[0]);
        formData.append("userId", userProfileStore!.id);

        console.log(formData);

        const res: ServerResponse = await uploadImage(formData);

        if( !res.success && res.errors ){
            setError("editfoto");
            setErrorDetail(res.errors[0].msg);
            setProcess("");
            return;
        };

        await dataUser.editUser(userProfileStore!.id, "", res.data as string);

        setUserProfileStore({ 
            id: userProfileStore!.id,
            name: userProfileStore!.name,
            email: userProfileStore!.email,
            imgUrl: res.data as string
        });

        wscStore!.send(JSON.stringify({
            type: "update-user",
            originUserId: userProfileStore!.id,
            destinationUserId: "",
            message: "",
            updateImgUrl: res.data,
            contacts: JSON.stringify(contactos.map( contacto => contacto.id))
        }));

        setProcessOk(true);
    };

    const handleClose = () => {
        setShowProfileView(false);
        setError("");
        setProcess("");
        setUserDataProfile(dataProfile);
        setSendToken(false);
        setProcessOk(false);
    }

    return(
        <Dialog open={showProfileView} as="div" className="relative z-40 focus:outline-none" onClose={handleClose}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-300/50">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className={`${ darkMode ? "bg-[#121212] text-white" : "bg-white" } shadow-2xl w-full sm:w-auto rounded-xl  p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0`}
                    >
                        <div className="flex items-center">
                            <div
                                className="cursor-pointer w-10 h-10 flex justify-center items-center gap-2 rounded-full active:scale-150 transition-all duration-75 active:bg-slate-200"
                                onClick={handleClose}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                            <DialogTitle as="h3" className="text-base/7 font-semibold">
                                Mi perfil
                            </DialogTitle>
                        </div>
                        <div className="flex justify-center">
                            <ProfileMainData />
                        </div>
                        <div className="flex flex-col gap-10 p-2">
                            <div className="border-t border-slate-200 pt-2">
                                <div className="flex items-center gap-2 mt-5">
                                    <div 
                                        aria-label="Editar nombre"
                                        className={`flex justify-center items-center rounded-full h-10 w-10 ${ darkMode ? "bg-cyan-400" : "bg-slate-200 hover:bg-slate-300" }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-center font-semibold">Editar nombre</p>
                                </div>
                                <form className="flex flex-col sm:flex-row gap-2 sm:items-center py-2">
                                    <input 
                                        id="username"
                                        type="text" 
                                        placeholder="Nombre"
                                        className={`${ darkMode ? "bg-[#333333] border-[#252525] focus:border-[#505050] text-white" : "focus:border-slate-400" } w-full h-10 resize-none p-1 border-2 rounded-md focus:outline-none `}
                                        onChange={(e) => {
                                            setUserDataProfile( state => ({ ...state, name: e.target.value }));
                                            setError("");
                                            setErrorDetail("");
                                            setProcess("");
                                        }}
                                    />
                                    <input 
                                        type="button" 
                                        aria-label="Actualizar nombre" 
                                        value={"Actualizar"}
                                        className={`${ darkMode && "border-[#333333] border-2"  } bg-black hover:bg-gray-600 w-full text-white inline-flex items-center gap-2 rounded-md  border py-1.5 px-2 text-sm/6 font-semibold cursor-pointer`}
                                        onClick={handleEditName}
                                    />
                                </form>
                                {
                                    process === "editname" && processOk === false && <Spinner/>
                                }
                                {
                                    error === "editname" && <p className="text-center text-red-700 text-xm font-semibold">{errorDetail}</p>
                                }
                                {
                                    processOk && process === "editname" && <p className="mt-5 text-center text-sm font-semibold text-green-700">Nombre de usuario actualizado</p>
                                }
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                                <div className="flex items-center gap-2 mt-5">
                                    <div 
                                        aria-label="Editar nombre"
                                        className={`flex justify-center items-center rounded-full h-10 w-10 ${ darkMode ? "bg-cyan-400" : "bg-slate-200 hover:bg-slate-300" }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-center font-semibold">Subir foto de perfil</p>
                                </div>
                                <form className="flex flex-col sm:flex-row gap-2 sm:items-center py-2">
                                    <input 
                                        type="file"
                                        accept="image/png, image/jpeg" 
                                        onChange={(e) => handleUploadFoto(e)} 
                                        className="mt-5"                              
                                    />
                                </form>
                                {
                                    process === "editfoto" && processOk === false && <Spinner/>
                                }
                                {
                                    error === "editfoto" && <p className="text-center text-red-700 text-xm font-semibold">{errorDetail}</p>
                                }
                                {
                                    processOk && process === "editfoto" && <p className="mt-5 text-center text-sm font-semibold text-green-700">Foto de perfil actualizada</p>
                                }
                            </div>
                            <div className="border-t border-slate-200 pt-2">
                                <div className="flex items-center gap-2 mt-5">
                                    <div className={`flex justify-center items-center rounded-full h-10 w-10 ${ darkMode ? "bg-cyan-400" : "bg-slate-200 hover:bg-slate-300" }`} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-center font-semibold">Cambiar contraseña</p>
                                </div> 
                                    
                                        <form className="flex flex-col gap-2 py-2">
                                            <div className="flex items-center gap-5">
                                                <input 
                                                    id="token"
                                                    type="text" 
                                                    placeholder="Token"
                                                    className={`${ darkMode ? "bg-[#333333] border-[#252525] focus:border-[#505050] text-white" : "focus:border-slate-400" } w-full h-10 resize-none p-1 border-2 rounded-md focus:outline-none `}
                                                    onChange={(e) => {
                                                        setUserDataProfile( state => ({ ...state, token: e.target.value }) )
                                                        setError("");
                                                    }}
                                                />
                                                {
                                                    sendToken ? 
                                                    <p className="text-green-700">Token enviado a tu correo electrónico</p>
                                                    :
                                                    <input
                                                        type="button"
                                                        value="Enviar token"
                                                        className={`${ darkMode && "border-[#333333] border-2" } w-auto text-white rounded-md bg-black border hover:bg-gray-600 py-1.5 px-2 text-sm/6 font-semibold cursor-pointer`}
                                                        onClick={handleSendToken}
                                                    />                                                   
                                                }
                                            </div>
                                            <input 
                                                id="new-password"
                                                type="password" 
                                                placeholder="Nueva contraseña"
                                                className={`${ darkMode ? "bg-[#333333] border-[#252525] focus:border-[#505050] text-white" : "focus:border-slate-400" } w-full h-10 resize-none p-1 border-2 rounded-md focus:outline-none `}
                                                onChange={(e) => {
                                                    setUserDataProfile( state => ({ ...state, password: e.target.value }) )
                                                    setError("");
                                                }}
                                            />
                                            <input 
                                                id="confirm-password"
                                                type="password" 
                                                placeholder="Confirmar contraseña"
                                                className={`${ darkMode ? "bg-[#333333] border-[#252525] focus:border-[#505050] text-white" : "focus:border-slate-400" } w-full h-10 resize-none p-1 border-2 rounded-md focus:outline-none `}
                                                onChange={(e) => {
                                                    setUserDataProfile( state => ({ ...state, passwordConfirm: e.target.value }) )
                                                    setError("");
                                                }}
                                            />
                                            <input 
                                                type="button"  
                                                value={"Actualizar"}
                                                className={`${ darkMode && "border-[#333333] border-2" } text-white inline-flex items-center gap-2 rounded-md bg-black border hover:bg-gray-600 py-1.5 px-2 text-sm/6 font-semibold cursor-pointer`}
                                                onClick={handleEditPass}
                                            />
                                        </form>
                                        {
                                            error === "editpass" && <p className="text-center text-red-700 text-xm font-semibold">{errorDetail}</p>
                                        }
                                        {
                                            processOk && process === "editpass" && <p className="mt-5 text-center text-sm font-semibold text-green-700">Contraseña actualizada</p>
                                        }
                            </div>
                        </div> 
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}