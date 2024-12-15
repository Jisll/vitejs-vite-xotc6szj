interface BoxesProps {
    className?: string;
    stroke?: string;
}

export default function Boxes({
    className,
    stroke
}: BoxesProps) {
    return (
        <svg 
            className={className}
            xmlns='http://www.w3.org/2000/svg' 
            width='28' 
            height='28' 
            viewBox='0 0 28 28' 
            fill='none'>
            <path 
                d='M19.8333 11.6667H22.1666C24.4999 11.6667 25.6666 10.5 25.6666 8.16668V5.83334C25.6666 3.50001 24.4999 2.33334 22.1666 2.33334H19.8333C17.4999 2.33334 16.3333 3.50001 16.3333 5.83334V8.16668C16.3333 10.5 17.4999 11.6667 19.8333 11.6667Z' 
                stroke={stroke}
                strokeWidth='1.5' 
                strokeMiterlimit='10' 
                strokeLinecap='round' 
                strokeLinejoin='round'/>
            <path 
                d='M5.83325 25.6667H8.16659C10.4999 25.6667 11.6666 24.5 11.6666 22.1667V19.8333C11.6666 17.5 10.4999 16.3333 8.16659 16.3333H5.83325C3.49992 16.3333 2.33325 17.5 2.33325 19.8333V22.1667C2.33325 24.5 3.49992 25.6667 5.83325 25.6667Z' 
                stroke={stroke}
                strokeWidth='1.5' 
                strokeMiterlimit='10'
                strokeLinecap='round' 
                strokeLinejoin='round'/>
            <path 
                d='M6.99992 11.6667C9.57725 11.6667 11.6666 9.57734 11.6666 7.00001C11.6666 4.42268 9.57725 2.33334 6.99992 2.33334C4.42259 2.33334 2.33325 4.42268 2.33325 7.00001C2.33325 9.57734 4.42259 11.6667 6.99992 11.6667Z' 
                stroke={stroke}
                strokeWidth='1.5' 
                strokeMiterlimit='10' 
                strokeLinecap='round' 
                strokeLinejoin='round'/>
            <path 
                d='M20.9999 25.6667C23.5772 25.6667 25.6666 23.5773 25.6666 21C25.6666 18.4227 23.5772 16.3333 20.9999 16.3333C18.4226 16.3333 16.3333 18.4227 16.3333 21C16.3333 23.5773 18.4226 25.6667 20.9999 25.6667Z' 
                stroke={stroke}
                strokeWidth='1.5' 
                strokeMiterlimit='10' 
                strokeLinecap='round' 
                strokeLinejoin='round'/>
        </svg>
    );
}