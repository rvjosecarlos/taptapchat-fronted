import { dataUser } from "./config/dataUser";
import { useEffect, useState } from "react";
import { appZustandStore } from "./store";
import Login from "./components/login/Login";
import Registro from "./components/registro/Registro";
import ChatApp from "./components/ChatApp";
import { loadDataUser } from "./api/userAPI";
import Spinner from "./components/Spinner";
import { ServerResponse } from "./types";

function App() {
  const [spinner, setSpinner] = useState(true);
  const userProfile = appZustandStore.useUserStore( state => state.userProfile );
  const setUserProfile = appZustandStore.useUserStore( state => state.setUserProfile );
  const newUser = appZustandStore.useUserStore( state => state.newUser );
  const setNewUser = appZustandStore.useUserStore( state => state.setNewUser );
  const createDataBase = dataUser.createDataBase;
  const params = new URLSearchParams(location.href);
  console.log(location.href);
  const nu = params.get("nu");
  //const sp = params.get("sp");
  const token = params.get("token");
  console.log(nu,token);

  if( nu && token ){
    setNewUser(JSON.parse(nu));
  }

  useEffect(()=>{
    const iniciarBD = async () => {
      await createDataBase();
    };
    iniciarBD();
    console.log("nuevo usuario", newUser);

    // Cargar el perfil si existe un token de sesion
    const iniciarSesionConToken = async () => {
      const res: ServerResponse = await loadDataUser();
      console.log(res);
      if( res && res.success && res.data && typeof res.data === "object" ){
        // Cargar el usuario logueado
        let usuario = await dataUser.loadUserProfile(res.data.id);
        console.log("Usuario buscado", usuario[0]);
        setUserProfile(usuario[0]);
      }
      else{
        console.log("Error controlado");
      }
    };
    iniciarSesionConToken();
    setSpinner(false);
  },[]);

  if( spinner ) return ( 
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <Spinner/> 
        <p>Iniciando TapTapChat!</p>
      </div>
    </div>
  )

  if(userProfile && !newUser && !spinner) return (
    <ChatApp/>
  )

  if(newUser && !spinner){
    return <Registro tokenParam={token ? token : ""}/>
  }
  
  if(!spinner) return <Login/>
}

export default App