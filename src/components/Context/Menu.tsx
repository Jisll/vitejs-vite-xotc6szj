import { ForwardRefRenderFunction, useState, useRef, useImperativeHandle, useEffect, Children, cloneElement, forwardRef } from 'react';

import styles from '@/styles/contextmenu.module.css';

export interface ContextMenuComponentHandle {
    visible: boolean;

    show: (x: number, y: number) => void;
    close: () => void;

    setParent: (element: HTMLElement) => void;
}

interface ContextMenuProps {
    children: React.ReactNode;
}

export function ContextMenuSeparator() {
    return (
        <div className={styles.separator} />
    );
}

export function ContextMenuItem({
    title,
    onClick,
    onClose
}: { 
    title: string;
    onClick?: () => void;
    onClose?: () => void;
}) {
    const handleClick = () => {
        if (onClick)
            onClick();

        if (onClose)
            onClose();
    }

    return (
        <div className={styles.item} onClick={handleClick}>
            <div className={styles.header}>
                {title}
            </div>
        </div>
    );
}

const ContextMenu: ForwardRefRenderFunction<ContextMenuComponentHandle, ContextMenuProps> = ({ children }, ref) => {
    const [contextMenu, setContextMenu] = useState<{ visible: boolean, absoluteX: number, absoluteY: number }>({
        visible: false,
        absoluteX: 0,
        absoluteY: 0
    });

    const [parent, setParent] = useState<HTMLElement | null>(null);

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const close = () => {
        setContextMenu({
            visible: false,
            absoluteX: 0,
            absoluteY: 0
        });
    }
    
    useImperativeHandle(ref, () => ({
        get visible() {
            return contextMenu.visible;
        },
        show: (x: number, y: number) => {
            if (contextMenuRef.current) {
                const menu = contextMenuRef.current;
                const menuRect = menu.getBoundingClientRect();

                let newX = x;
                let newY = y;

                if (x + menuRect.width > window.innerWidth) {
                    newX = window.innerWidth - menuRect.width;
                }
                if (y + menuRect.height > window.innerHeight) {
                    newY = window.innerHeight - menuRect.height;
                }

                setContextMenu({
                    visible: true,
                    absoluteX: newX,
                    absoluteY: newY
                });
            }
        },
        close,
        setParent: (element: HTMLElement) => {
            setParent(element);
        }
    }));

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (contextMenuRef.current) {
                if (parent && parent.contains(event.target as Node)) {
                    return;
                }

                if (!contextMenuRef.current.contains(event.target as Node)) {
                    close();
                }
            }
        }
    
        const iframes = document.getElementsByTagName('iframe');

        document.addEventListener('click', handleClick);

        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];

            iframe.contentWindow?.document.addEventListener('click', handleClick);
        }

        return () => {
            document.removeEventListener('click', handleClick);

            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];

                iframe.contentWindow?.document.removeEventListener('click', handleClick);
            }
        }
    }, [contextMenuRef, parent]);

    return (
        <div 
            ref={contextMenuRef}
            className={styles.container}
            style={{
                display: 'block',
                top: contextMenu.absoluteY,
                left: contextMenu.absoluteX,
                position: 'fixed',
                zIndex: 100,

                opacity: contextMenu.visible ? 1 : 0,
                pointerEvents: contextMenu.visible ? 'auto' : 'none'
            }}>
            { children && Children.map(children, (child) => {
                return cloneElement(child as React.ReactElement, {
                    onClose: close
                });
            })}
        </div>
    )
}

export default forwardRef(ContextMenu);