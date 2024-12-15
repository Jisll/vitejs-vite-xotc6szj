import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FileOrFolder {
    name: string;
    uri: string;
    expanded?: boolean;
    children?: FileOrFolder[];
}

export interface Tab {
    name: string;
    uri: string;
    parent?: string;
    deleted?: boolean;
    text: string;
}

export interface Group {
    name: string;
    uri: string;
    parent?: string;
}

export interface WorkspaceState {
    files: FileOrFolder[];
    tabs: Tab[]
}

const updateTree = (tree: FileOrFolder[], files: FileOrFolder[]): FileOrFolder[] => {
    const findFileOrFolderByName = (name: string, files: FileOrFolder[]): FileOrFolder | undefined =>
        files.find(file => file.name === name);

    const updateFileOrFolder = (file: FileOrFolder[], children: FileOrFolder[]): FileOrFolder[] => {
        const updatedFileOrFolders = file.reduce((acc: FileOrFolder[], file: FileOrFolder) => {
            const child = findFileOrFolderByName(file.name, children);
            if (!child) {
                acc.push(file);
            } else if (child.children) {
                acc.push({
                    ...file,
                    children: updateFileOrFolder(file.children || [], child.children),
                    expanded: file.hasOwnProperty('expanded') ? file.expanded : false,
                });
            }
            return acc;
        }, []);

        const newChildren = children.filter(child => !findFileOrFolderByName(child.name, file))
            .map(child => ({
                ...child,
                expanded: child.hasOwnProperty('expanded') ? child.expanded : false,
            }));

        return [...updatedFileOrFolders, ...newChildren];
    };

    return updateFileOrFolder(tree, files);
};

const groupTreeByName = (tabs: Tab[]): Group[][] => {
    const result: Record<string, Group[]> = {};

    const traverse = (tabs: Tab[]) => {
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];

            if (!result[tab.name]) {
                result[tab.name] = [];
            }

            const leaf = {
                name: tab.name,
                uri: tab.uri
            };

            result[tab.name].push(leaf);
        }
    }

    traverse(tabs);

    return Object.values(result).filter(group => group.length > 1);
}

const groupTreeByParent = (tabs: Tab[]): Group[][] => {
    const groups = groupTreeByName(tabs);

    const getParents = (group: Group[], behind = 1): string[] => {
        let result: string[] = [];

        for (let i = 0; i < group.length; i++) {
            const tab = group[i];

            const parts = tab.uri.split('/');

            result.push(`../${parts[parts.length - 1 - behind]}` + (behind > 1 ? '/..' : ''))
        }

        return result;
    }

    const findParents = (group: Group[]): string[] => {
        let behind = 1;

        const minDepth = group.reduce((min, tab) => {
            const depth = tab.uri.split('/').length;

            return depth < min ? depth : min;
        }, Infinity);

        while (behind < minDepth) {
            const parents = getParents(group, behind);

            const filtered = parents.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) === index);

            if (filtered.length > 1) {
                return filtered;
            }

            behind++;
        }

        return [];
    }

    return groups.map(group => {
        const parents = findParents(group);

        return group.map((tab: any, index: number) => ({
            ...tab,
            parent: parents[index]
        }));
    });
}

const alphabetical = (files: FileOrFolder[]): FileOrFolder[] => {
    const isFolder = (file: FileOrFolder): boolean => file.children !== undefined;

    const sortChildren = (children: FileOrFolder[]): FileOrFolder[] => {
        const folders = children.filter(isFolder).sort((a, b) => a.name.localeCompare(b.name));
        const files = children.filter(child => !isFolder(child)).sort((a, b) => a.name.localeCompare(b.name));

        return [
            ...folders.map(folder => ({
                ...folder,
                children: sortChildren(folder.children || []),
                expanded: folder.expanded ?? false,
            })),
            ...files
        ];
    };

    return sortChildren(files);
};

export const initialState: WorkspaceState = {
    files: [],
    tabs: []
};

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<FileOrFolder[]>) => {
            state.files = action.payload;

            state.files = alphabetical(state.files);
        },
        updateItem: (state, action: PayloadAction<FileOrFolder[]>) => {
            state.files = updateTree(state.files, action.payload);

            state.files = alphabetical(state.files);
        },
        toggleFolder: (state, action: PayloadAction<FileOrFolder>) => {
            const findFileOrFolder = (uri: string, files: FileOrFolder[]): FileOrFolder | undefined => {
                for (let file of files) {
                    if (file.uri === uri) {
                        return file;
                    }

                    if (file.children) {
                        const found = findFileOrFolder(uri, file.children);

                        if (found)
                            return found;
                    }
                }
            }

            const file = findFileOrFolder(action.payload.uri, state.files);

            if (!file)
                return;

            if (!file.children)
                return;

            file.expanded = !file.expanded;
        },
        addTab: (state, action: PayloadAction<Tab>) => {
            if (state.tabs.some(tab => tab.uri === action.payload.uri))
                return;

            state.tabs.push(action.payload);

            const normalized = groupTreeByParent(state.tabs);

            for (let i = 0; i < normalized.length; i++) {
                const group = normalized[i];

                for (let j = 0; j < group.length; j++) {
                    const item = group[j];

                    const index = state.tabs.findIndex(tab => tab.uri === item.uri);

                    if (index === -1)
                        continue;

                    state.tabs[index].parent = item.parent;
                }
            }
        },
        removeTab: (state, action: PayloadAction<string>) => {
            state.tabs = state.tabs.filter(tab => tab.uri !== action.payload);

            const group = groupTreeByName(state.tabs);

            for (let i = 0; i < state.tabs.length; i++) {
                const tab = state.tabs[i];

                if (!tab.parent)
                    continue;

                const found = group.find((group: any) => group.find((item: any) => item.uri === tab.uri));

                if (!found)
                    state.tabs[i].parent = undefined;
            }
        },
        replaceTab: (state, action: PayloadAction<{ newUri: string, oldUri: string, text: string }>) => {
            let index = state.tabs.findIndex(tab => tab.uri === action.payload.oldUri);

            if (index === -1)
                return;

            const found = state.tabs.find(tab => tab.uri === action.payload.newUri);

            if (found)
                state.tabs = state.tabs.filter(tab => tab.uri !== action.payload.newUri);

            index = state.tabs.findIndex(tab => tab.uri === action.payload.oldUri);

            state.tabs[index].uri = action.payload.newUri;

            state.tabs[index].name = action.payload.newUri.split('/').pop() || 'Untitled';

            state.tabs[index].text = action.payload.text;

            {
                const normalized = groupTreeByParent(state.tabs);

                for (let i = 0; i < normalized.length; i++) {
                    const group = normalized[i];

                    for (let j = 0; j < group.length; j++) {
                        const item = group[j];

                        const index = state.tabs.findIndex(tab => tab.uri === item.uri);

                        if (index === -1)
                            continue;

                        state.tabs[index].parent = item.parent;
                    }
                }
            }
        },
        markTab: (state, action: PayloadAction<{ uri: string, mark: boolean }>) => {
            const index = state.tabs.findIndex(tab => {
                const parts = tab.uri.split('/');

                if (parts.length === 2)
                    return tab.uri.endsWith(action.payload.uri);

                parts.pop();

                return parts.join('/').endsWith(action.payload.uri);
            });

            if (index === -1)
                return;

            state.tabs[index].deleted = action.payload.mark;
        }
    },
});

export const {
    setFiles,
    updateItem,
    toggleFolder,
    addTab,
    removeTab,
    replaceTab,
    markTab
} = {
    setFiles: workspaceSlice.actions.setFiles,
    updateItem: workspaceSlice.actions.updateItem,
    toggleFolder: workspaceSlice.actions.toggleFolder,
    addTab: workspaceSlice.actions.addTab,
    removeTab: workspaceSlice.actions.removeTab,
    replaceTab: workspaceSlice.actions.replaceTab,
    markTab: workspaceSlice.actions.markTab
}

export default workspaceSlice.reducer;