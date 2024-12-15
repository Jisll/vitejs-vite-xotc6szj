import { useState, useEffect } from 'react';
import { fetchAvatarHeadshotAsync } from '@/api/roblox';
import { toast } from 'react-toastify';

import LazyImage from '@/components/LazyImage';
import Check from '@/components/icons/Check';

import styles from '@/styles/overlay/client/card.module.css';

interface CardProps {
    id: string;
    name: string;
    game: string;
    selected: boolean;
    
    onCheck?: (id: string) => void;
}

export default function Card({
    id,
    name,
    game,
    selected,
    onCheck
}: CardProps) {
    const [avatar, setAvatar] = useState('');

    const handleToggle = () => {   
        if (!onCheck)
            return;

        onCheck(id);
    }

    useEffect(() => {
        if (!id)
            return;

        if (id === '0')
            return;

        fetchAvatarHeadshotAsync(id)
            .then(response => {
                const data = response.data.data

                if (!data.length)
                    return;

                setAvatar(data[0].imageUrl);
            })
            .catch(() => {
                toast.error(`Filed to fetch avatr for ${name}. (${id})`);
            });
    }, []);

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={styles.player}>{name}</div>
                <div className={styles.game}>{game}</div>
                <div className={styles.checkbox} onClick={handleToggle}>
                    {selected && <Check className={styles.check} fill='white'/>}
                </div>
            </div>
            <div className={styles.avatar}>
                <LazyImage src={avatar} alt={name}/>
            </div>
        </div>
    );
}