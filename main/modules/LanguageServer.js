const jsonRpc = import('vscode-ws-jsonrpc');
const jsonRpcServer = import('vscode-ws-jsonrpc/server');
const { app } = require('electron');
const path = require('path');
const ws = require('ws');

const IsRequest = require('../helpers/IsRequest');

const createLanguageServer = async (socket) => {
    const { WebSocketMessageReader, WebSocketMessageWriter } = await jsonRpc;
    const { createConnection, createServerProcess, forward } = await jsonRpcServer;

    const dir = app.isPackaged ? path.resolve(__dirname, '../../../node_modules/language-server') : path.resolve(__dirname, '../../public/language-server');

    const resolve = (file) => {        
        return path.resolve(dir, file);
    }

    const reader = new WebSocketMessageReader(socket);

    const writer = new WebSocketMessageWriter(socket);

    const connection = createConnection(reader, writer, () => socket.close());

    const server = createServerProcess('Luau Language, Server', resolve('wave-luau.exe'), [
        'lsp',
        `--definitions=${resolve('globalTypes.d.luau')}`,
        `--definitions=${resolve('wave.d.luau')}`,
        `--docs=${resolve('en-us.json')}`,
    ]);

    forward(connection, server, message => {
        if (IsRequest(message))
            message.params.processId = process.pid;

        return message;
    });
}

class LanguageServer {
    #port = 0;

    #server = undefined;

    constructor(port) {
        this.#port = port;

        this.#server = new ws.Server({ port: this.#port, path: '/language-server' });

        this.#server.on('connection', socket => {
            const leaf = {
                send: data => {
                    socket.send(data, error => {
                        if (error)
                            throw error
                    });
                },
                onMessage: (handler) => {
                    socket.on('message', handler);
                },
                onError: (handler) => {
                    socket.on('error', handler);
                },
                onClose: (handler) => {
                    socket.on('close', handler);
                },
                close: () => {
                    socket.close(); 
                }
            }

            if (socket.readyState === 1)
                createLanguageServer(leaf);
            else
                socket.on('open', () => createLanguageServer(leaf));
        });
    }
}

module.exports = LanguageServer;