import { useState, useEffect } from 'react';

import styles from '@/styles/overlay/settings/base.module.css';

interface SelectorProps {
    title: string;
    description?: string;
    values: any[];
    preferred: any;
    readonly?: boolean;

    onChange?: (value: any) => void;
}

export default function Selector({
    title,
    description,
    values,
    preferred,
    readonly,
    onChange
}: SelectorProps) {
    const [value, setValue] = useState(preferred || values[0]);

    const handleClick = (v: string) => {
        if (readonly)
            return;

        setValue(v);

        onChange && onChange(v);
    }

    useEffect(() => {
        setValue(preferred);
    }, [preferred]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {title}
            </div>
            {description && <div className={styles.description}> {description} </div>}
            <div className={styles.selections}>
                {
                    values.map((v, i) => {
                        return (
                            <div className={`${styles.button} ${value === v ? styles.active : ''}`} key={i} onClick={() => handleClick(v)}>
                                { typeof v === 'boolean' ? (v ? 'Enabled' : 'Disabled') : v }
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}