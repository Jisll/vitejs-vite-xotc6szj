interface NavButtonProps {
    className: string;
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

export default function NavButton({
    className,
    children,
    active,
    onClick
}: NavButtonProps) {
    return (
        <div 
            className={className + (active ? ' active' : '')}
            onClick={onClick}>
            {children}
        </div>
    );
}