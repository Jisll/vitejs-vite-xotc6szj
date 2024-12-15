interface MaximizeProps {
    className?: string;
    stroke?: string;
}

export default function Exit({
    className,
    stroke
}: MaximizeProps) {
    return (
        <svg
            className={className}
            xmlns='http://www.w3.org/2000/svg' 
            width='13' 
            height='14' 
            viewBox='0 0 13 14'
            fill='none'>
            <path 
                d='M0.5 1.25L12 12.75' 
                stroke={stroke}
                strokeLinecap='round'/>
            <path 
                d='M12 1.25L0.5 12.75'
                stroke={stroke}
                strokeLinecap='round'/>
        </svg>
    );
}