import { useClient } from '@/contexts/ClientContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { scriptAsync } from '@/api/scriptBlox';
import { toast } from 'react-toastify';

import LazyImage from '@/components/LazyImage';

import styles from '@/styles/overlay/cloud/card.module.css';

interface CardProps {
    slug: string;
    title: string;
    game: string;
    type: string;
    image: string;
}

export default function Card({
    slug,
    title,
    game,
    type,
    image
}: CardProps) {
    const { client, ready } = useClient();

    const clients = useSelector((state: RootState) => state.client.clients);

    const handleExecute = async () => {
        if (!client || !ready)
            return;

        try {
            const { script } = await scriptAsync(slug);

            const ids = Object.keys(clients).filter(tkey => clients[tkey].selected) as string[];

            client.roblox.execute(ids, { uri: slug, text: script.script });
        } catch {
            toast.error('Failed to load script');
        }
    }

    const handleCopy = async () => {
        try {
            const { script } = await scriptAsync(slug);

            navigator.clipboard.writeText(script.script);
        } catch {
            toast.error('Failed to load script');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.properties}>
                    <div className={styles.property}>
                        <div className={styles.variable}>
                            Game
                        </div>
                        <div className={styles.value}>
                            {game}
                        </div>
                    </div>
                    <div className={styles.property}>
                        <div className={styles.variable} style={{ marginRight: 7.5 }}>
                            Type
                        </div>
                        <div className={styles.value}>
                            {type}
                        </div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <div className={styles.button} onClick={handleExecute}>
                   
                        Execute
                    </div>
                    <div className={styles.button} onClick={handleCopy}>
                        Copy To Clipboard
                    </div>
                </div>
            </div>
            <LazyImage className={styles.right} src={image} alt={image} />
        </div>
    );
}