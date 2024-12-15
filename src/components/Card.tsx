import styles from '@/styles/card.module.css';

export interface CardProps {
    id?: string;
    title: string;
    description: string;
    checkBox?: boolean;

    onClick?: () => void;
}

export default function Card({
    id,
    title,
    description,
    checkBox,
    onClick
}: CardProps) {
    return (
        <div className={styles.container}>
            <div className={styles.separator}></div>
            <div className={styles.main}>
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
            </div>
        </div>
    );
}