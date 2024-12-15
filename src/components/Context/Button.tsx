import React, { useEffect } from 'react';
import { useRef } from 'react';

import ContextMenu, { ContextMenuComponentHandle } from './Menu';

interface ControlButtonProps {
    className: string;
    title: string;
    children: React.ReactNode;
}

export default function ContextButton({
    className,
    title,
    children
}: ControlButtonProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    const contextMenuRef = useRef<ContextMenuComponentHandle>(null);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (!contextMenuRef.current)
            return;

        if (contextMenuRef.current.visible)
            return;

        contextMenuRef.current.show(event.clientX, event.clientY);
    }

    useEffect(() => {
        if (!elementRef.current)
            return; 

        if (!contextMenuRef.current)
            return;

        contextMenuRef.current.setParent(elementRef.current);
    }, [elementRef]);

    return (
        <div
            ref={elementRef}
            onClick={handleContextMenu}>
            <div className={className}>
                {title}
            </div>  
            <ContextMenu 
                ref={contextMenuRef}>
                {children}
            </ContextMenu>
        </div>
    );
}