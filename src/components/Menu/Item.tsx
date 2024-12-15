import styles from '@/styles/overlay.module.css';

interface ItemProps {
    header: string;
    active?: boolean;
    onClick?: () => void;

    children: React.ReactElement;
}

export default function Item({
    header,
    active,
    onClick,
    children
}: ItemProps) {
    const handleClick = () => {
        if (!onClick)
            return;

        onClick();
    }
    
    return (
        <div className={`${styles.item} ${active ? styles.active : ''}`} onClick={handleClick}>
            {children}
            {header}
        </div>
    )
}
