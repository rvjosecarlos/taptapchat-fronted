import { appZustandStore } from "../../store";
import ActiveContact from "./ActiveContact";
import FormChat from "./FormChat";
import MessageHistory from "./MessageHistory";

export default function Chat(){
    const showChatElement = appZustandStore.useModalStore(state => state.showChatElement);
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    return(
        <section 
            className={`relative w-full border-2  rounded-r-lg  sm:block transition-colors duration-500
                ${ darkMode ? "border-2 border-[#252525] bg-[#1E1E1E]" :"border-slate-200 bg-white" }
                ${ showChatElement ? "block aparecer" : "hidden" }
            `}
        >
            <ActiveContact />
            <MessageHistory />
            <FormChat />
        </section>
    )
}