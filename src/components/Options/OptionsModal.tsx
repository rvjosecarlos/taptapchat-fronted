import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { appZustandStore } from '../../store';
import { logout } from '../../api/authAPI';
import OptionsBackup from './OptionsBackup';
import { dataUser } from '../../config/dataUser';
import { createBackup } from '../../services/backupProcess/backupProcess';
import OptionsProfile from './OptionsProfile';

export default function Example() {
    
    const setShowBackupView = appZustandStore.useModalStore( state => state.setShowBackupView );
    const setShowProfileView = appZustandStore.useModalStore( state => state.setShowProfileView );
    const userProfile = appZustandStore.useUserStore(state => state.userProfile);
    const wscStore = appZustandStore.useSocketStore(state => state.wscStore);
    const setCerrarSesion = appZustandStore.useUserStore( state => state.setCerrarSesion );
    const setDarkMode = appZustandStore.useAppDarkStore( state => state.setDarkMode );
    const darkMode = appZustandStore.useAppDarkStore( state => state.darkMode );

    const handleDarkMode = async () => {
        setDarkMode( !darkMode );
        localStorage.setItem("darkMode", (!darkMode).toString());
    };

    const handleCerrarSesión = async () => {
        setCerrarSesion(true);
        await createBackup();
        await logout(userProfile!.id);
        wscStore!.close();
        await dataUser.clearAllBD();
        localStorage.removeItem("darkMode");
        location.reload();
    };

    return (
        <>
            <div>
                <Menu>
                    <MenuButton 
                        aria-label='Menú'
                        className={`${ darkMode ? "bg-[#333333]" : "bg-black" } inline-flex items-center gap-2 rounded-md py-1 px-1 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white`}
                    >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>       
                    </MenuButton>
                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="backdrop-blur-sm w-52 origin-top-right rounded-xl border border-black/5 shadow-2xl bg-white/5 p-1 text-sm/6 text-black font-semibold transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <MenuItem>
                            <button 
                                aria-label='Perfil'
                                className={`${ darkMode ? "text-white data-[focus]:bg-[#333333]" : "bg-white/80 data-[focus]:bg-slate-200" } group flex w-full items-center gap-2 rounded-t-lg py-1.5 px-3 `}
                                onClick={() => setShowProfileView(true)}
                            >
                                <div className='flex justify-between items-center w-full'>
                                    <p>Perfil</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                </div>
                            </button>
                        </MenuItem>

                        <MenuItem>
                            <button 
                                aria-label='Tema'
                                className={`${ darkMode ? "text-white data-[focus]:bg-[#333333]" : "bg-white/80 data-[focus]:bg-slate-200" } group flex w-full items-center gap-2 py-1.5 px-3 `}
                                onClick={handleDarkMode}
                            >
                                <div className='flex justify-between w-full'>
                                    <p>{`Tema ${ darkMode ? "claro" : "oscuro"}`}</p>
                                    <div className='flex justify-center items-center'>
                                        {
                                            darkMode ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                                </svg>
                                            :
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                                </svg>
                                        }
                                    </div>
                                </div>
                            </button>
                        </MenuItem>

                        <MenuItem>
                            <button 
                                aria-label="Copia de seguridad"
                                className={`${ darkMode ? "text-white data-[focus]:bg-[#333333]" : "bg-white/80 data-[focus]:bg-slate-200" } group flex w-full items-center gap-2 py-1.5 px-3 `}
                                onClick={() => {
                                    console.log("copia de serguirdad");
                                    setShowBackupView(true)
                                }}
                            >
                                <div className='flex justify-between items-center w-full'>
                                    <p>Copia de seguridad</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                    </svg>
                                </div>
                            </button>
                        </MenuItem>

                        <MenuItem>
                            <button 
                                aria-label='Cerrar sesión'
                                className={`${ darkMode ? "text-white data-[focus]:bg-[#333333]" : "bg-white/80 data-[focus]:bg-slate-200" } group flex w-full items-center gap-2 rounded-b-lg py-1.5 px-3 `}
                                onClick={handleCerrarSesión}
                            >
                                <div className='flex justify-between items-center w-full'>
                                    <p>Cerrar sesión</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                </div>
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
            <OptionsBackup/>
            <OptionsProfile/>
        </>
    )
}