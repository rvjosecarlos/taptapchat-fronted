import { appZustandStore } from "../../store";

export default function SearchBar(){
    const { contactos, setContactosFiltrados } = appZustandStore.useContactListStore( state => state);
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        if( e.target.value.length ){
            const searchContact = contactos.filter( contacto => contacto.nameContact.toLowerCase().includes(e.target.value.toLowerCase())  );
            setContactosFiltrados(searchContact);
            return;
        }

        setContactosFiltrados(contactos);
    }

    return(
        <div className="w-full pl-2 p-1">
            <form>
                <input 
                    type="search" 
                    className={`${ darkMode && "bg-[#252525] border-[#252525]" } w-full p-1 border rounded-md focus:outline-none focus:border-slate-400 transition-colors duration-500`}
                    placeholder="Buscar contacto"
                    onChange={handlerSearch}
                />
            </form>
        </div>
    );
}