import More from '../../components/icons/More';

import styles from '@/styles/pane.module.css';

export default function Robotics() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Robotics </div>
                <div className={styles.menu}>
                    <More className={styles.more} />
                </div>
            </div>
            <div className={styles.searchContainer}>
                <input className={styles.search} type='text' placeholder='Send a message...'/>
            </div>
            <div className={styles.content}>
        
            </div>
        </div>
    );
}