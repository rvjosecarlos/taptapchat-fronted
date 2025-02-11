type LogoProps = {
    className: string;
}

export default function Logo({ className }: LogoProps){
    return(
        <img 
            src="/ttc-tp-icon-outbg.webp" 
            alt="logo-taptapcht" 
            className={className}
        />
    )
}