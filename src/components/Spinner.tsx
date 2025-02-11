import { appZustandStore } from "../store";

export default function Spinner(){
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    return(
        <div className="flex justify-center">
            <div className="sk-chase">
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
                <div className={`${ darkMode ? "sk-chase-dot-dark" : "sk-chase-dot"}`}></div>
            </div>
        </div>
    );
}