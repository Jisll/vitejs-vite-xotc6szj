interface HomeProps {
    className?: string;
    stroke?: string;
}

export default function Home({
    className,
    stroke = 'currentColor'
}: HomeProps) {
    return (
        <svg 
            className={className}
            xmlns='http://www.w3.org/2000/svg' 
            width='20' 
            height='20' 
            viewBox='0 0 20 20' 
            fill='none'>
            <path 
                d='M16.6666 14.1666V9.54327C16.6666 9.09827 16.6666 8.87577 16.6124 8.66827C16.5645 8.48485 16.4856 8.31096 16.3791 8.1541C16.2583 7.9766 16.0916 7.8291 15.7558 7.5366L11.7558 4.0366C11.1341 3.49243 10.8224 3.21993 10.4724 3.1166C10.1641 3.02493 9.83575 3.02493 9.52659 3.1166C9.17659 3.21993 8.86659 3.4916 8.24492 4.03493L4.24409 7.5366C3.90909 7.82993 3.74159 7.9766 3.62159 8.15327C3.51475 8.31034 3.43556 8.48451 3.38742 8.66827C3.33325 8.87494 3.33325 9.09827 3.33325 9.54327V14.1666C3.33325 14.9433 3.33325 15.3316 3.45992 15.6374C3.54358 15.8397 3.66627 16.0235 3.82098 16.1784C3.97569 16.3332 4.15939 16.4561 4.36159 16.5399C4.66825 16.6666 5.05659 16.6666 5.83325 16.6666C6.60992 16.6666 6.99825 16.6666 7.30492 16.5399C7.50711 16.4561 7.69081 16.3332 7.84552 16.1784C8.00023 16.0235 8.12292 15.8397 8.20658 15.6374C8.33325 15.3316 8.33325 14.9433 8.33325 14.1666V13.3333C8.33325 12.8912 8.50885 12.4673 8.82141 12.1548C9.13397 11.8422 9.55789 11.6666 9.99992 11.6666C10.4419 11.6666 10.8659 11.8422 11.1784 12.1548C11.491 12.4673 11.6666 12.8912 11.6666 13.3333V14.1666C11.6666 14.9433 11.6666 15.3316 11.7933 15.6374C11.8769 15.8397 11.9996 16.0235 12.1543 16.1784C12.309 16.3332 12.4927 16.4561 12.6949 16.5399C13.0016 16.6666 13.3899 16.6666 14.1666 16.6666C14.9433 16.6666 15.3316 16.6666 15.6383 16.5399C15.8404 16.4561 16.0241 16.3332 16.1789 16.1784C16.3336 16.0235 16.4563 15.8397 16.5399 15.6374C16.6666 15.3316 16.6666 14.9433 16.6666 14.1666Z' 
                stroke={stroke}
                strokeWidth='1.66667' 
                strokeLinecap='round' 
                strokeLinejoin='round'/>
        </svg>
    );
}