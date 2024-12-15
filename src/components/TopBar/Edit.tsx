import { useMonaco } from '@/contexts/MonacoContext';
import ContextButton from '../Context/Button';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/Context/Menu';

import styles from '@/styles/topbar.module.css';

export default function Edit() {
    const monaco = useMonaco();

    const handleUndo = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.undo();
    }

    const handleRedo = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.redo();
    }
    
    const handleCut = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.cut();
    }

    const handleCopy = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.copy();
    }

    const handlePaste = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.paste();
    }

    const handleFind = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.find();
    }

    const handleReplace = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.replace();
    }

    const handleToggleLineComment = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.toggleLineComment();
    }

    const handleToggleBlockComment = () => {
        if (!monaco)
            return;

        if (!monaco.current)
            return;

        monaco.current.toggleBlockComment();
    }

    return (
        <ContextButton className={styles.edit} title='Edit'>
            <ContextMenuItem title='Undo' onClick={handleUndo}/>
            <ContextMenuItem title='Redo' onClick={handleRedo}/>

            <ContextMenuSeparator />

            <ContextMenuItem title='Cut' onClick={handleCut}/>
            <ContextMenuItem title='Copy' onClick={handleCopy}/>
            <ContextMenuItem title='Paste' onClick={handlePaste}/>

            <ContextMenuSeparator />

            <ContextMenuItem title='Find' onClick={handleFind}/>
            <ContextMenuItem title='Replace' onClick={handleReplace}/>

            <ContextMenuSeparator />

            <ContextMenuItem title='Toggle Line Comment' onClick={handleToggleLineComment}/>
            <ContextMenuItem title='Toggle Block Comment' onClick={handleToggleBlockComment}/>
        </ContextButton>
    );
}