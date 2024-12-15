import { ForwardRefRenderFunction, useState, useRef, useImperativeHandle, useEffect, Children, cloneElement, forwardRef, use } from 'react';

import ChevronDown from '@/components/icons/ChevronDown';

import styles from '@/styles/treeview.module.css';

export interface TreeViewItemComponentHandle {
    rename: () => void;
}

interface TreeViewItemProps {
    icon?: React.ReactNode;
    title: string;
    children: React.ReactNode;

    expanded?: boolean;

    onLeftClick?: () => void;
    onRightClick?: () => void;
}

const TreeViewItem: ForwardRefRenderFunction<TreeViewItemComponentHandle, TreeViewItemProps> = ({ icon, title, children, expanded, onLeftClick, onRightClick }, ref) => {
    const [rename, setRename] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        handleApply(event.currentTarget.value);
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        handleApply(event.target.value);   
    }

    const handleApply = (text: string) => {
        setRename(false);
    }
    
    useImperativeHandle(ref, () => ({
        rename: () => {
            setRename(true);
        }
    }));

    useEffect(() => {
        if (!rename || !inputRef.current)
            return;

        inputRef.current.focus();

        inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }, [rename]);
    
    return (
        <div className={styles.container}>
            <div 
                className={`${styles.header} ${expanded ? styles.active : ''}`} 
                onClick={onLeftClick}>
                <div className={styles.icon}> 
                    { children && <ChevronDown className={styles.svg} /> }
                    { !children && icon }
                </div>
                { rename && <input ref={inputRef} value={title} onKeyDown={handleKeyDown} onBlur={handleBlur} /> }
                { !rename && <div className={styles.title} onContextMenu={onRightClick}>{title}</div> }
            </div>
            { expanded && children }
        </div>
    );
}

export default forwardRef(TreeViewItem);