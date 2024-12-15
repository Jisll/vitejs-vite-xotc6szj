import styles from '@/styles/overlay/settings/base.module.css';

interface RedeemerProps {
    product: 'premium' | 'freemium' | 'none';
    expiration: Date | null;

    onRedeem?: (code: string) => void;
    onFreemium?: () => void;
}

export default function Redeemer({
    product,
    expiration,
    onRedeem,
    onFreemium
}: RedeemerProps) {
    const date = expiration ? expiration.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;    

    return (
        <div className={styles.container}>
        <div className={styles.title}>
            License Key
        </div>
        <div className={styles.description}>
            { date ? `You have an active ${product} membership valid until ${date}.` : 'You currently have no active membership.' }
        </div>
        <div className={styles.selections}>
            <input 
                className={styles.input}
                placeholder='XXXXX-XXXXX-XXXXX-XXXXX'
                onKeyDown={(evt) => {
                    if (evt.key !== 'Enter')
                        return;

                    const target = evt.target as HTMLInputElement;

                    const value = target.value;

                    if (onRedeem)
                        onRedeem(value);
                }}/>
            <div className={styles.button} onClick={onFreemium}>
                Freemium
            </div>
        </div>
    </div>
    )
}