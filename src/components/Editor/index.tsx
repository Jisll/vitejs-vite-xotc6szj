import { useClient } from '@/contexts/ClientContext';
import { useMonaco } from '@/contexts/MonacoContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRef, useState, useEffect } from 'react';
import { Tab, FileOrFolder, addTab, removeTab, replaceTab, markTab } from '@/store/reducer/workspace';

import TabList, { TabListHandle } from '@/components/Tab/List';
import Monaco, { TextDocument, TextDocumentChange } from './Monaco';
import Draggable from '@/components/Draggable';
import Exit from '@/components/icons/Exit';

import styles from '@/styles/editor.module.css';

const getNextNumber = (strings: string[]) => {
    const numbers = strings
        .map(str => {
            const match = str.match(/^Untitled-(\d+)$/);

            return match ? parseInt(match[1], 10) : null;
        })
        .filter(num => num !== null)
        .sort((a, b) => a - b);

    if (numbers.length === 0 || numbers[0] > 1)
        return 1;

    for (let i = 0; i < numbers.length - 1; i++)
        if (numbers[i + 1] !== numbers[i] + 1)
            return numbers[i] + 1;

    return numbers[numbers.length - 1] + 1;
}

export default function Editor() {
    const { client, ready } = useClient();

    const monaco = useMonaco();

    const dispatch = useDispatch();

    const tabs = useSelector((state: RootState) => state.workspace.tabs);

    const tabListRef = useRef<TabListHandle>(null);

    const [textDocument, setTextDocument] = useState<TextDocument>({ uri: '', text: '' });

    const handleSelectionChange = (tab: Tab) => {
        setTextDocument({
            uri: tab.uri,
            text: tab.text
        });
    }

    const handleSelectionClose = (tab: Tab) => {
        dispatch(removeTab(tab.uri));

        monaco?.current?.closeTextDocument(tab.uri);
    }

    const handleAddTab = () => {
        const names = tabs.map(tab => tab.name);

        const nextNumber = getNextNumber(names);

        const name = `Untitled-${nextNumber}`;
        
        dispatch(addTab({ uri: `Untitled-${nextNumber}`, name, text: '' }));
    }

    useEffect(() => {
        if (!client || !ready)
            return;

        const getUriFromObject = (object: FileOrFolder): string => {
            if (object.children) {
                for (let child of object.children) {
                    const uri = getUriFromObject(child);

                    if (uri)
                        return uri;
                }
            }

            return object.uri;
        }

        const handleTextDocumentOpen = (data: any) => {
            const { uri, text } = data.textDocument as TextDocument;

            const name = uri.split('/').pop() || 'Untitled';

            const tab = tabs.find(tab => tab.uri === uri);

            if (tab) {
                if (tabListRef.current) {
                    tabListRef.current.selectTab(tab);
                }

                return;
            }

            dispatch(addTab({ uri, name, text }));
        }

        const handleTextDocumentSave = (data: any) => {
            const { uri, text } = data.textDocument as TextDocumentChange;

            dispatch(replaceTab({ newUri: uri.new, oldUri: uri.old, text }));
        }

        const listeners: string[] = [
            client.workspace.on('textDocument/onDidTextDocumentOpen', handleTextDocumentOpen),
            client.workspace.on('textDocument/onDidTextDocumentSave', handleTextDocumentSave),
            
            client.workspace.on('node/didAppend', (data: FileOrFolder) => {
                const uri = getUriFromObject(data);

                dispatch(markTab({ uri, mark: false }));
            }),

            client.workspace.on('node/didDeduct', (data: FileOrFolder) => {
                const uri = getUriFromObject(data);

                dispatch(markTab({ uri, mark: true }));
            })
        ];

        return () => {
            for (let listener of listeners) {
                client.workspace.off(listener);
            }
        }
    }, [client, ready]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.tabs}>
                    <TabList 
                        ref={tabListRef}
                        items={tabs} 
                        OnSelectionChange={handleSelectionChange} 
                        OnSelectionClose={handleSelectionClose}/>
                    <div className={styles.button}>
                        <div className={styles.icon} onClick={handleAddTab}>
                            <Exit stroke='currentColor'/>
                        </div>
                    </div>
                </div>
                <div 
                    className={styles.editor}
                    style={{
                        display: tabs.length === 0 ? 'none' : 'block'
                    }}>
                    <Monaco textDocument={textDocument}/>
                </div>
            </div>
            <Draggable/>
        </>
    );
}