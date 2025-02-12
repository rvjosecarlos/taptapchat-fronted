import { appZustandStore } from "../../store";
import { Contact } from "../../types";

type AvatarProps = {
    online?: Contact['online'],
    toList: Contact['toList'],
    imgUrl?: Contact['imgUrl'],
    profile?: boolean
}

export default function Avatar({ online, /*toList,*/ imgUrl, profile }: AvatarProps){
    const { userProfile } = appZustandStore.useUserStore( state => state );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );
    console.log(userProfile);

    return(
        <div className={`flex justify-center items-center rounded-full ${ profile ? "h-16 w-16" : "h-12 w-12" } ${ online ? "border-4 border-lime-500 shadow-sm shadow-lime-500" : "border-2 border-slate-300" } ${ darkMode ? "bg-white" : "" }`}>
            {
                !imgUrl ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                :
                    <img 
                        className={`${ profile ? "w-12 h-12" : "w-10 h-10" } rounded-full object-cover shadow-lg`}
                        src={imgUrl}
                        alt="Foto de perfil" 
                    />
            }     
        </div>
    );
}