interface MaximizeProps {
    className?: string;
    stroke?: string;
}

export default function Maximize({
    className,
    stroke
}: MaximizeProps) {
    return (
        <svg
            className={className} 
            xmlns='http://www.w3.org/2000/svg' 
            width='12' 
            height='13' 
            viewBox='0 0 12 13' 
            fill='none'>
            <path 
                d='M2.5 3.25V2.25C2.5 1.69772 2.94772 1.25 3.5 1.25H10.5C11.0523 1.25 11.5 1.69772 11.5 2.25V8.25C11.5 8.80228 11.0523 9.25 10.5 9.25H9.5' 
                stroke={stroke}/>
            <rect 
                x='0.5' 
                y='3.25'
                width='9'
                height='9' 
                rx='1.5' 
                stroke={stroke}/>
        </svg>
    );
}