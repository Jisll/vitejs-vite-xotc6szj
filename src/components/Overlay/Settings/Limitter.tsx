import React, { useState, useEffect } from 'react';

import styles from '@/styles/overlay/settings/base.module.css';

interface BaseProps {
    children: React.ReactNode;
}

interface LimitterProps extends BaseProps {
    min: number;
    max: number;
    value: number;
    unit: string;

    onChange: (value: number) => void;
}

type TitleProps = BaseProps;

type DescriptionProps = BaseProps;

const Limitter: React.FC<LimitterProps> & { Title: React.FC<TitleProps>, Description: React.FC<DescriptionProps> } = ({ min, max, value, unit, onChange, children }) => {    
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
        let newValue = e.target.value as string | number;

        if (newValue === '') {
            return;
        }

        if (!/^\d*$/.test(newValue as string)) 
            return;

        newValue = parseInt(newValue as string);

        if (newValue < min)
            newValue = min;
        else if (newValue > max)
            newValue = max;

        setInputValue(newValue);
        onChange(newValue);
    };

    useEffect(() => {
        if (min > value) {
            onChange(min);
            setInputValue(min);
        } else {
            setInputValue(value);
            onChange(value);
        }
    }, [value]);

    return (
        <div className={styles.container}>
            {children}
            <div className={styles.limitter}>
                <input type='text' value={inputValue} onChange={handleChange}/> of {max} {unit}
            </div>
        </div>
    );
};

const Title: React.FC<TitleProps> = ({ children }) => {
    return (
        <div className={styles.title}>
            {children}
        </div>
    );
};

const Description: React.FC<DescriptionProps> = ({ children }) => {
    return (
        <div className={styles.description}>
            {children}
        </div>
    );
};

Limitter.Title = Title;

Limitter.Description = Description;

Limitter.displayName = 'Limitter';

export default Limitter;