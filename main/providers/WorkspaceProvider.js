const Provider  = require('../modules/Provider');
const Watcher = require('../modules/Watcher');

const { getWorkspace } = require('../helpers/WorkspaceHelper');
const { join, isAbsolute, normalize } = require('path');
const { existsSync, mkdirSync, lstatSync, readFileSync, writeFileSync } = require('fs');
const { dialog } = require('electron');

const initializer = (server) => {
    const workspace = new Provider('workspace', server);

    workspace.registerFeature('initialize', data => {
        let watcher = workspace.getVariable('watcher');

        if (watcher)
            watcher.close();

        if (data.params.workspace === null)
            return;

        const absolutePath = join(process.cwd(), data.params.workspace);

        if (!existsSync(absolutePath))
            mkdirSync(absolutePath);

        watcher = new Watcher(absolutePath);

        watcher.on('item/added', data => {
            workspace.sendResponse('node/didAppend', data);
        });

        watcher.on('item/removed', data => {
            workspace.sendResponse('node/didDeduct', data);
        });

        watcher.on('item/changed', data => {
            workspace.sendResponse('node/didChange', data);
        });

        workspace.sendResponse('initialized', {
            data: getWorkspace(absolutePath, absolutePath)
        });

        workspace.setVariable('watcher', watcher);

        workspace.setVariable('workspace', data.params.workspace);

        workspace.setVariable('absolute-workspace', absolutePath);
    });

    workspace.registerFeature('openTextDocument', async data => {
        const getFileContent = (uri) => {
            if (!existsSync(uri))
                return;

            if (lstatSync(uri).isDirectory())
                return;

            const content = readFileSync(uri, 'utf-8');

            return content;
        }

        if (data.params.textDocument.uri === null) {
            // const { cancelled, filePaths } = await dialog.showOpenDialog({
            //     properties: ['openFile']
            // });

            // if (cancelled)
            //     return;

            // if (filePaths.length === 0)
            //     return;

            // const file = filePaths[0];

            // if (!existsSync(file))
            //     return;

            // if (lstatSync(file).isDirectory())
            //     return;

            // if (!file.endsWith('.lua') && !file.endsWith('.txt') && !file.endsWith('.luau'))
            //     return;

            // if (!file.startsWith(workspace.getVariable('absolute-workspace'))) {
            //     console.log('File is not in workspace');

            //     console.log('watch file');
            // }

            // workspace.sendResponse('textDocument/onDidTextDocumentOpen', {
            //     textDocument: {
            //         uri: file,
            //         text: getFileContent(file)
            //     }
            // });
        } else {
            workspace.sendResponse('textDocument/onDidTextDocumentOpen', {
                textDocument: {
                    uri: data.params.textDocument.uri,
                    text: getFileContent(data.params.textDocument.uri)
                }
            });
        }
    });
    
    workspace.registerFeature('saveTextDocument', async data => {
        let uri = decodeURIComponent(data.params.textDocument.uri);

        uri = uri.replace(workspace.getVariable('workspace'), workspace.getVariable('absolute-workspace')).replace(/\\/g, '/');

        if (!isAbsolute(uri)) {
            const { filePath } = await dialog.showSaveDialog({
                defaultPath: workspace.getVariable('absolute-workspace') + '/' + uri + '.luau'
            });

            if (!filePath)
                return;

            const newUri = filePath.replace(workspace.getVariable('absolute-workspace'), workspace.getVariable('workspace')).replace(/\\/g, '/');

            writeFileSync(filePath, data.params.textDocument.text);

            workspace.sendResponse('textDocument/onDidTextDocumentSave', {
                textDocument: {
                    uri: {
                        new: newUri,
                        old: uri,
                    },
                    text: data.params.textDocument.text
                }
            });
        } else {
            writeFileSync(uri, data.params.textDocument.text);
        }
    });

    return workspace;
}

module.exports = initializer;