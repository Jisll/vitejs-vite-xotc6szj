import { useClient } from '@/contexts/ClientContext';
import { useRef, useState, useEffect } from 'react';

import Exit from '@/components/icons/Exit';

import styles from '@/styles/terminal.module.css';

const Message = ({
    date,
    type = 'info',
    children
}: {
    date: string;
    type?: 'error' | 'warning' | 'info' | 'print' | 'debug';
    children: React.ReactNode;
}) => {
    return (
        <div className={styles.message}>
            [{date}] [<span className={styles[type]}>{type}</span>]&nbsp;&gt;&nbsp;{children}
        </div>
    );
}

export default function Terminal() {
    const { client, ready } = useClient();

    const elementRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<{ type: string, message: string, increments: number, created_at: string }[]>([]);

    useEffect(() => {
        if (!client || !ready) return;
    
        client.roblox.on('client/console', ({ type, message, created_at }) => {
            type = type.split('/').pop();
    
            if (type === 'clear')
                return setMessages([]);
    
            setMessages(prevMessages => {
                if (prevMessages.some(msg => msg.message === message)) {
                    return prevMessages.map(msg => {
                        if (msg.message === message)
                            return { ...msg, increments: msg.increments + 1 };
    
                        return msg;
                    });
                }
    
                return [...prevMessages, { type, message, increments: 0, created_at }];
            });
    
            if (elementRef.current)
                elementRef.current.scrollTop = elementRef.current.scrollHeight;
        });
    }, [client, ready]);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.tabs}>
                    <div className={styles.tab}>
                        <div className={styles.header}>Terminal </div>
                        <div className={styles.separator}></div>
                    </div>
                </div>
                <Exit className={styles.hide}/>
            </div>
            <div ref={elementRef} className={styles.content}>
                {messages.map((message, index) => (
                    <Message key={index} date={message.created_at} type={message.type as any}>
                        {message.message + (message.increments > 0 ? ` (${message.increments}x)` : '')}
                    </Message>
                ))}
            </div>
        </div>
    )
}