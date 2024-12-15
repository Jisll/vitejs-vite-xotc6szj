import { useClient } from '@/contexts/ClientContext';
import ContextButton from '../Context/Button';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/Context/Menu';

import styles from '@/styles/topbar.module.css';

export default function File() {
    const { client, ready } = useClient();

    const handleExit = () => {
        if (!client || !ready)
            return;

        client.application.exit();
    }

    return (
        <ContextButton className={styles.file} title='File'>            
            <ContextMenuItem title='New File' />
            
            <ContextMenuSeparator />

            <ContextMenuItem title='Open File' />
            <ContextMenuItem title='Open Folder' />

            <ContextMenuSeparator />

            <ContextMenuItem title='Save' />
            <ContextMenuItem title='Save As' />
            <ContextMenuItem title='Save All' />

            <ContextMenuSeparator />

            <ContextMenuItem title='Exit' onClick={handleExit} />
        </ContextButton>
    );
}