interface LogoutProps {
    className?: string;
    stroke?: string;
}

export default function Logout({
    className,
    stroke
}: LogoutProps) {
    return (
        <svg
            className={className} 
            xmlns='http://www.w3.org/2000/svg' 
            width='26' 
            height='26'
            viewBox='0 0 26 26' 
            fill='none'>
            <path 
                d='M16.2501 13H2.16675M2.16675 13L5.95841 9.75M2.16675 13L5.95841 16.25' 
                stroke={stroke}
                strokeWidth='1.25' 
                strokeLinecap='round' 
                strokeLinejoin='round'/>
            <path 
                d='M9.7522 7.58329C9.7652 5.22704 9.87028 3.95088 10.7023 3.11888C11.6545 2.16663 13.1864 2.16663 16.25 2.16663H17.3334C20.3981 2.16663 21.9299 2.16663 22.8822 3.11888C23.8334 4.07004 23.8334 5.60296 23.8334 8.66663V17.3333C23.8334 20.397 23.8334 21.9299 22.8822 22.881C22.0491 23.7141 20.7729 23.8181 18.4167 23.8311M9.7522 18.4166C9.7652 20.7729 9.87028 22.049 10.7023 22.881C11.3967 23.5765 12.4009 23.764 14.0834 23.8149' 
                stroke={stroke}
                strokeWidth='1.25' 
                strokeLinecap='round'/>
        </svg>
    );
}