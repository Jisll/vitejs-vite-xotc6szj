import styles from '@/styles/overlay/settings/base.module.css';

interface DescriptorProps {
    title: string;
    children: React.ReactNode;
}

export default function Descriptor({
    title,
    children
}: DescriptorProps) {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {title}
            </div>
            <div className={styles.description}>
                {children}
            </div>
        </div>
    );
}