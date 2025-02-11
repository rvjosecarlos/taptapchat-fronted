import { appZustandStore } from "../../store"
import type { Message } from "../../types"

type MessageProps = Pick<Message, "message" | "send" | "time" |"leido">

export default function Message({ message, send, /*time, leido*/ }: MessageProps){
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    let clases = "";
    if( darkMode && send ){
        clases = "bg-[#333333] text-white";
    }
    else if( darkMode && !send ){
        clases = "bg-cyan-400"
    }
    else if( !darkMode && send ){
        clases = "bg-black text-white"
    }
    else{
        clases = "bg-cyan-400"
    }


    return(
        <div className={`flex mb-4 ${send ? " justify-end": ""}`}>
            <p
                className={`p-2 rounded-lg transition-colors duration-500 ${ clases }`}
            >
                {message}
            </p>
        </div>
    )
}