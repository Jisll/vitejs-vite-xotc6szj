import styles from '@/styles/overlay.module.css';

interface ContentProps {
    active?: boolean;
    children: React.ReactNode;
}

const Content: React.FC<ContentProps> & { Header: React.FC<{ title: string, children?: React.ReactNode }>, Frame: React.FC<{ children?: React.ReactNode }> } = ({
    active,
    children
}: ContentProps) => {
    return (
        <div className={`${styles.content} ${active ? styles.active : ''}`}>
            {children}
        </div>
    )
}

const Header: React.FC<{ title: string, children?: React.ReactNode }> = ({ title, children }) => {
    return (
        <div className={styles.header}>
            <span className={styles.title}>
                {title}
            </span>
            {children}
        </div>
    )
}

const Frame: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.frame}>
            {children}
        </div>
    )
}

Content.Header = Header;

Content.Frame = Frame;

Content.displayName = 'Content';

export default Content;