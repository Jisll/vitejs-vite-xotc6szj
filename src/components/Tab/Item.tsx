import Exit from '@/components/icons/Exit';

import styles from '@/styles/tabs.module.css';

export interface TabProps {
    header: string;
    subHeader?: string;
    selected?: boolean;
    deleted?: boolean;

    onClick?: () => void;
    onClose?: () => void;
}

export default function TabItem({ 
    header,
    subHeader,
    selected = true,
    deleted,
    onClick,
    onClose
}: TabProps) {
    const handleClick = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.classList.contains(styles.exit))
            return;

        if (target.tagName === 'svg' || target.tagName === 'path')
            return;

        if (onClick)
            onClick();
    }

    const handleClose = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (onClose)
            onClose();
    }

    return (
        <div className={`${styles.tab} ${selected ? styles['tab--selected'] : ''}`} onClick={handleClick}>
            <div className={`${styles.header} ${deleted ? styles['header--deleted'] : ''}`}>
                {header}
            </div>
            { subHeader && <div className={styles.subHeader}> {subHeader} </div> }
            <div className={styles.exit} onClick={handleClose}>
                <Exit stroke='white'/>
            </div>
        </div>
    );
}