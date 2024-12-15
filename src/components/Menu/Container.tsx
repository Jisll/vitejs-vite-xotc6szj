import React, { useState, Children, isValidElement, cloneElement } from 'react';
import Item from './Item';
import Content from './Content';

import styles from '@/styles/overlay.module.css';

type Extended<T> = T & { active: boolean };

interface Props<T> {
    children?: React.ReactElement<Extended<T>> | React.ReactElement<Extended<T>>[];
}

type LeftProps = Props<typeof Item> & { title: string, index?: number, setIndex?: (index: number) => void};

type RightProps = Props<typeof Content> & { index?: number };

const Container: React.FC<{ className: string, children: React.ReactNode }> & { Left: React.FC<LeftProps & { title: string }>, Right: React.FC<RightProps> } = ({ className, children }) => {
    const [index, setIndex] = useState(0);

    const handleTabChange = (index: number) => {
        if (index === index)
            return;

        setIndex(index);
    }

    return (
        <div 
            className={className}
            style={{
                minWidth: 703
            }}>
            {
                Children.map(children, child => {
                    if (!isValidElement(child))
                        return child;

                    return cloneElement(child as React.ReactElement, { 
                        index,
                        setIndex 
                    });
                })
            }
        </div>
    );
};

const Left: React.FC<LeftProps> = ({ title, index, setIndex, children }) => {
    return (
        <div className={styles.left}>
            <div className={styles.title}>
                {title}
            </div>
            {
                Children.map(children, (child, idx) => {
                    if (!isValidElement(child))
                        return child;

                    return cloneElement(child as React.ReactElement, { 
                        active: index === idx,
                        onClick: () => setIndex && setIndex(idx)
                    });
                })
            }
        </div>
    );
};

const Right: React.FC<RightProps> = ({ index, children }) => {
    return (
        <div className={styles.right}>
            {
                Children.map(children, (child, idx) => {
                    if (!isValidElement(child))
                        return child;

                    return cloneElement(child as React.ReactElement, { 
                        active: index === idx
                    });
                })
            }
        </div>
    );
};

Container.Left = Left;

Container.Right = Right;

Container.displayName = 'Container';

export default Container;
