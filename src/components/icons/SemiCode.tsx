interface SemiCodeProps {
    className?: string;
    fill?: string;
}

export default function Code({
    className,
    fill
}: SemiCodeProps) {
    return (
        <svg 
            className={className}
            xmlns='http://www.w3.org/2000/svg' 
            width='20' 
            height='20' 
            viewBox='0 0 20 20' 
            fill='none'>
            <path 
                d='M6.66675 15L1.66675 10L6.66675 5L7.85425 6.1875L4.02091 10.0208L7.83341 13.8333L6.66675 15ZM13.3334 15L12.1459 13.8125L15.9792 9.97917L12.1667 6.16667L13.3334 5L18.3334 10L13.3334 15Z' 
                fill={fill}/>
        </svg>
    );
}