import { useClient } from '@/contexts/ClientContext';
import { useMonaco } from '@/contexts/MonacoContext';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import Handle from '@/components/icons/Handle';
import Execute from '@/components/icons/Execute';
import ExecuteFile from '@/components/icons/ExecuteFile';

import styles from '@/styles/draggable.module.css';

export default function Draggable() {
    const { client, ready } = useClient();

    const monaco = useMonaco();

    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    const elementRef = useRef<HTMLDivElement>(null);

    const dragging = useRef(false);

    const offset = useRef({ x: 0, y: 0 });

    const clients = useSelector((state: RootState) => state.client.clients);

    const handleMouseDown = (event: any) => {
        if (!elementRef.current)
            return;

        dragging.current = true;

        offset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y
        };

        const iframes = document.querySelectorAll('iframe');

        iframes.forEach(iframe => iframe.style.pointerEvents = 'none');

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (event: any) => {
        if (!elementRef.current)
            return;

        if (!dragging.current)
            return;

        const x = event.clientX - offset.current.x;
        const y = event.clientY - offset.current.y;

        const { width, height } = elementRef.current.getBoundingClientRect();

        setPosition({
            x: Math.max(25, Math.min(x, (window.innerWidth - 25) - width)),
            y: Math.max(25, Math.min(y, (window.innerHeight - 25) - height))
        });
    }

    const handleMouseUp = () => {
        if (!elementRef.current)
            return;

        dragging.current = false;

        const iframes = document.querySelectorAll('iframe');

        iframes.forEach(iframe => iframe.style.pointerEvents = 'auto');

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    const handleExecute = () => {
        if (!client || !ready)
            return;

        if (!monaco || !monaco.current)
            return;

        const ids = Object.keys(clients).filter(tkey => clients[tkey].selected) as string[];
    
        client.roblox.execute(ids, monaco.current.getTextDocument());
    }

    const handleExecuteFile = () => {
        if (!client || !ready)
            return;

        const ids = Object.keys(clients).filter(tkey => clients[tkey].selected) as string[];

        client.roblox.executeFile(ids);
    }

    const handleStop = () => {

    }

    useEffect(() => {
        if (!elementRef.current)
            return;

        const { innerWidth, innerHeight } = window;

        const { width, height } = elementRef.current.getBoundingClientRect();

        const x = (innerWidth - width) / 2;

        const y = (innerHeight - height) / 6;

        setPosition({ x, y });
    }, []);

    return (
        <div 
            ref={elementRef} 
            className={styles.container}
            style={{
                opacity: Object.keys(clients).length > 0 ? 1 : 0,
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: 'opacity 0.25s ease',
                pointerEvents: Object.keys(clients).length > 0 ? 'all' : 'none'
            }}>
            <div className={styles.handle} onMouseDown={handleMouseDown}>
                <Handle className={styles.draggable} />
            </div>
            <div className={styles.button} onMouseDown={handleExecute}>
                <Execute />
            </div>
            <div className={styles.button} onMouseDown={handleExecuteFile}>
                <ExecuteFile />
            </div>
        </div>
    );
}