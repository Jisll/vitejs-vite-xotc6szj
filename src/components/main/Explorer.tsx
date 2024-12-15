import { useClient } from '@/contexts/ClientContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { FileOrFolder, updateItem, toggleFolder } from '@/store/reducer/workspace';

import More from '@/components/icons/More';
import TreeViewItem from '@/components/TreeView/Item';

import styles from '@/styles/pane.module.css';

export default function Explorer() {
    const { client, ready } = useClient();

    const dispatch = useDispatch();

    const files = useSelector((state: RootState) => state.workspace.files);

    const handleLeftClick = (targetItem: FileOrFolder) => {
        if (targetItem.children)
            dispatch(toggleFolder(targetItem));
        else {
            if (!client || !ready)
                return;

            client.workspace.openTextDocument(targetItem.uri);
        }
    }

    const getTree = (items: FileOrFolder[]) => {
        return items.map(item => {
            return (
                <TreeViewItem
                    key={item.name}
                    title={item.name}
                    expanded={item.expanded}
                    onLeftClick={() => handleLeftClick(item)}>
                    {
                        item.children && getTree(item.children)
                    }
                </TreeViewItem>
            )
        });
    }

    useEffect(() => {
        if (!client || !ready)
            return;
        
        const handleItemEvent = (data: FileOrFolder) => {
            dispatch(updateItem([data]));
        }

        const didAppend = client.workspace.on('node/didAppend', handleItemEvent);

        const didDeduct = client.workspace.on('node/didDeduct', handleItemEvent);

        return () => {
            client.workspace.off(didAppend);

            client.workspace.off(didDeduct);
        }
    }, [client, ready]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Workspace </div>
                <div className={styles.menu}>
                    <More className={styles.more} />
                </div>
            </div>
            <div className={styles.content}>
                {
                    files.length > 0 && getTree(files)
                }
            </div>
        </div>
    );
}