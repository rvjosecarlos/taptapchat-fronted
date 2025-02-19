import { memo } from "react";
import { Suspense } from "react";
import { categorias, emojis } from "../../emojis/emojist";
import { appZustandStore } from "../../store";
import Spinner from "../Spinner";

type EmojisContainerProps = {
    setMsj: React.Dispatch<React.SetStateAction<string>>
}

function EmojisContainer({ setMsj }: EmojisContainerProps){
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleClickEmoji = (indiceEmoji: number) => {
        setMsj((state) => state + emojis[indiceEmoji] );
    };
    
    return(
        <Suspense fallback={<Spinner/>}>
            <div
                className={`${ darkMode ? "bg-black/70 text-white border-[#252525]" : "bg-white/50 border border-slate-100" } border fixed bottom-24 -mb-1 h-72 w-72 overflow-x-hidden p-3 overflow-y-scroll grid grid-cols-8 gap-3 backdrop-blur-sm`}
            >
                {
                    emojis.map( (emoji, indice) => 
                        !categorias.includes(emoji) ? 
                            <div
                                key={indice} 
                                className="col-span-1 hover:bg-slate-200 rounded-sm"
                            >
                                <button                                  
                                    onClick={() => handleClickEmoji(indice)}>{emoji}
                                </button>
                            </div>
                        :
                            <p 
                                key={indice} 
                                className="col-span-8 font-bold text-sm"
                            >
                                {emoji}
                            </p>
                    )
                }
            </div>
        </Suspense>
    )
}

export default memo(EmojisContainer);