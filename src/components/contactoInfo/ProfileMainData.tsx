import { appZustandStore } from "../../store"
import Avatar from "./Avatar";

export default function ProfileMainData(){
    const { userProfile } = appZustandStore.useUserStore( state => state);
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    return(
        <div className="flex flex-col items-center mx-10 mt-5">
            {
                userProfile!.imgUrl ? 
                    <img 
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                        src={userProfile!.imgUrl}
                        alt="Foto de perfil" 
                    />
                :
                    <Avatar
                        toList={false}
                        profile={true}
                    />
            }
            <p 
                className={`${ darkMode ? "text-white" : "text-slate-500" } flex flex-col items-center p-3 font-semibold text-sm transition-colors duration-500`}
            >
                {userProfile?.name}
                <span style={{ fontSize: "10px" }}>{userProfile?.email}</span>
            </p>
        </div>
    )
}