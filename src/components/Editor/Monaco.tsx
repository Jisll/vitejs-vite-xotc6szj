import { useClient } from '@/contexts/ClientContext';
import { useMonaco } from '@/contexts/MonacoContext';
import { useRef, useImperativeHandle, useEffect, forwardRef, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';

import monaco from '@/types/monaco-editor';

import usePrevious from '@/hooks/usePrevious';

export interface MonacoComponentHandle {
    getTextDocument: () => TextDocument;
    closeTextDocument: (uri: string) => void;

    undo: () => void;
    redo: () => void;

    cut: () => void;
    copy: () => void;
    paste: () => void;

    find: () => void;
    replace: () => void;

    toggleLineComment: () => void;
    toggleBlockComment: () => void;
}

export interface TextDocument {
    uri: string;
    text: string;
}

export interface TextDocumentChange {
    uri: {
        new: string;
        old: string;
    },
    text: string;
}

interface MonacoProps {
    textDocument: TextDocument;
}

const ViewStates: Record<string, monaco.editor.ICodeEditorViewState> = {};

const Monaco: ForwardRefExoticComponent<MonacoProps & RefAttributes<MonacoComponentHandle>> = forwardRef(({ textDocument }: MonacoProps, ref: ForwardedRef<MonacoComponentHandle>) => {
    const { client } = useClient();

    const elementRef = useRef<HTMLIFrameElement>(null);

    const monacoRef = useRef<typeof monaco | null>(null);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const previousTextDocument = usePrevious(textDocument) as TextDocument | undefined;

    const toUri = (uri: string) => {
        if (!monacoRef.current)
            return;

        return monacoRef.current.Uri.parse(uri);
    }

    const getModel = (uri: monaco.Uri) => {
        if (!monacoRef.current)
            return;

        return monacoRef.current.editor.getModel(uri);
    }

    const getOrCreateModel = (uri: monaco.Uri, text: string) => {
        if (!monacoRef.current)
            return;

        const model = getModel(uri);

        if (model)
            return model;

        return monacoRef.current.editor.createModel(text, 'lua', uri);
    }

    useImperativeHandle(ref, () => ({
        getTextDocument: () => {
            return {
                uri: textDocument.uri,
                text: editorRef.current?.getValue() || ''
            }
        },
        closeTextDocument: (uri: string) => {
            console.log('closeTextDocument');

            if (!monacoRef.current || !editorRef.current)
                return;

            const normalizedUri = toUri(uri);

            if (!normalizedUri)
                return;

            const model = monacoRef.current.editor.getModel(normalizedUri);

            delete ViewStates[uri];

            if (!model)
                return;

            model.dispose();
        },
        undo: () => {
            if (!editorRef.current)
                return;

            editorRef.current.trigger('undo', 'undo', null);
        },
        redo: () => {
            if (!editorRef.current)
                return;

            editorRef.current.trigger('redo', 'redo', null);
        },
        cut: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('cut', 'editor.action.clipboardCutAction', null);
        },
        copy: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('copy', 'editor.action.clipboardCopyAction', null);
        },
        paste: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('paste', 'editor.action.clipboardPasteAction', null);
        },  
        find: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('find', 'actions.find', null);
        },
        replace: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('startFindReplaceAction', 'editor.action.startFindReplaceAction', null);
        },
        toggleLineComment: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('toggleLineComment', 'editor.action.commentLine', null);
        },
        toggleBlockComment: () => {
            if (!editorRef.current)
                return;

            editorRef.current.focus();

            editorRef.current.trigger('toggleBlockComment', 'editor.action.blockComment', null);
        }
    }));
    
    useEffect(() => {
        if (!elementRef.current)
            return;

        const iframe = elementRef.current;

        const window = iframe.contentWindow as any;

        if (!window.monaco || !window.editor)
            return;

        const _monaco = window.monaco as typeof monaco;

        const _editor = window.editor as monaco.editor.IStandaloneCodeEditor;

        const _binding = _editor.addCommand(2048 | 49, () => {
            if (!editorRef.current)
                return;

            const model = editorRef.current.getModel();
            
            const uri = (model?.uri.toString() || '').replace('file:///', '');

            const text = editorRef.current.getValue();

            // @ts-ignore
            client.workspace.saveTextDocument(uri, text);
        });

        monacoRef.current = _monaco;

        editorRef.current = _editor;
    }, [(elementRef.current?.contentWindow as any)?.monaco]);

    useEffect(() => {
        if (!monacoRef.current || !editorRef.current)
            return;

        if (!previousTextDocument)
            return;

        const uri = toUri(previousTextDocument.uri);

        if (!uri)
            return;

        const model = getModel(uri);

        if (!model)
            return;

        if (model.isDisposed())
            return;

        ViewStates[previousTextDocument.uri] = editorRef.current.saveViewState() as monaco.editor.ICodeEditorViewState;
    }, [textDocument]);

    useEffect(() => {
        if (!monacoRef.current || !editorRef.current)
            return;
                
        const uri = toUri(textDocument.uri);

        if (!uri)
            return;

        const model = getOrCreateModel(uri, textDocument.text);

        if (!model)
            return;

        editorRef.current.setModel(model);

        editorRef.current.focus();

        editorRef.current.layout();

        if (ViewStates[textDocument.uri])
            editorRef.current.restoreViewState(ViewStates[textDocument.uri]);
    }, [textDocument]); 
    
    return (
        <>
            <iframe
                ref={elementRef}
                src='monaco/index.html'
                height={'100%'}
                width={'100%'}
                frameBorder={0}/>
        </>
    );
});

const BaseComponent = ({  textDocument }: MonacoProps) => {
    const monacoRef = useMonaco();

    return (
        <Monaco ref={monacoRef} textDocument={textDocument} />
    );
}

Monaco.displayName = 'Monaco';

BaseComponent.displayName = 'Monaco';

export default BaseComponent;