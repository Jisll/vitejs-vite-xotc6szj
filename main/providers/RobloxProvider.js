const ws = require('ws');
const Provider = require('../modules/Provider');
const listener = require('../listener');
const { dialog } = require('electron');
const { readFileSync } = require('fs');

const tryJsonParse = (data) => {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

class RobloxProvider {
    #port = 0;

    #server = undefined;

    #listeners = [];

    clients = new Map();

    constructor(port) {
        this.#port = port;
    }

    start() {
        this.#server = new ws.Server({ port: this.#port });

        this.#server.on('connection', socket => {
            socket.json = (data) => socket.send(JSON.stringify(data));

            socket.status = (message, code) => {
                socket.json({ message, code });

                socket.close();
            }

            socket.on('message', raw => {
                const message = tryJsonParse(raw);

                if (!message)
                    return socket.close();

                const op = message.op;

                const data = message.data;

                switch (op) {
                    case 'client/identify': {
                        var identity = data;

                        var client = this.clients.values().find(client => client === socket);

                        if (client) {
                            this.invoke('client/update', identity);

                            break;
                        }

                        this.clients.set(identity.process.id, socket);

                        this.invoke('client/identify', identity);

                        break;
                    }
                    case 'client/ping': {
                        var client = this.clients.values().find(client => client === socket);

                        if (!client)
                            return socket.close();

                        socket.json({ op: 'client/pong', data: {} });

                        break;
                    }
                    case 'client/console/error':
                    case 'client/console/warning':
                    case 'client/console/print':
                    case 'client/console/info':
                    case 'client/console/debug':
                    case 'client/console/clear': {
                        const client = this.clients.values().find(client => client === socket);

                        if (!client)
                            return socket.close();

                        this.invoke('client/console', {
                            type: op,
                            message: data.message
                        });

                        break;
                    }
                    case 'client/authentication/error':
                    case 'client/compiler/error': {
                        const client = this.clients.values().find(client => client === socket);

                        if (!client)
                            return socket.close();

                        this.invoke('client/error', {
                            type: op,
                            message: data
                        });

                        break;
                    }
                    default:
                        break;
                }
            });

            socket.on('close', () => {
                const client = this.clients.values().find(client => client === socket);

                if (!client)
                    return;

                const id = this.clients.keys().find(key => this.clients.get(key) === client);

                this.clients.delete(id);

                this.invoke('client/disconnect', id);
            });
        });
    }

    restart() {
        if (this.#server)
            this.#server.close();

        this.clients.clear();

        this.start();
    }

    listen(event, listener) {
        this.#listeners.push({ event, listener });
    }

    invoke(event, data) {
        const listener = this.#listeners.find(l => l.event === event);

        if (!listener)
            return;

        listener.listener(data);
    }
}

const now = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const initializer = (server) => {
    const roblox = new Provider('roblox', server);

    const provider = new RobloxProvider(61416);

    listener.on('console/error', message => {
        roblox.sendResponse('client/console', {
            type: 'client/console/error',
            message,
            created_at: now()
        });
    });

    listener.on('console/success', message => {
        roblox.sendResponse('client/console', {
            type: 'client/console/debug',
            message,
            created_at: now()
        });
    });

    provider.listen('client/identify', data => {
        roblox.sendResponse('client/identify', {
            client: data
        });
    });

    provider.listen('client/update', data => {
        roblox.sendResponse('client/update', {
            client: data
        });
    });

    provider.listen('client/console', ({ type, message }) => {
        roblox.sendResponse('client/console', {
            type,
            message,
            created_at: now()
        });
    });

    provider.listen('client/error', ({ type, message }) => {
        roblox.sendResponse('client/error', {
            type,
            message
        });
    });

    provider.listen('client/disconnect', data => {
        roblox.sendResponse('client/disconnect', {
            client: {
                process: {
                    id: data
                }
            }
        });
    });

    roblox.registerFeature('initialize', data => {
        provider.restart();
    });

    roblox.registerFeature('execute', data => {
        const clients = data.params.clients;

        if (!Array.isArray(clients))
            return;

        clients.forEach(client => {
            const socket = provider.clients.get(client);

            if (!socket)
                return;

            socket.json({
                op: 'client/onDidTextDocumentExecute',
                data: {
                    textDocument: data.params.textDocument
                }
            });
        });
    });

    roblox.registerFeature('executeFile', async data =>{
        const clients = data.params.clients;

        if (!Array.isArray(clients))
            return;

        const { cancelled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile']
        });

        if (cancelled)
            return;

        if (filePaths.length === 0)
            return;

        const file = readFileSync(filePaths[0], 'utf-8');

        clients.forEach(client => {
            const socket = provider.clients.get(client);

            if (!socket)
                return;

            socket.json({
                op: 'client/onDidTextDocumentExecute',
                data: {
                    textDocument: {
                        uri: filePaths[0],
                        content: file
                    }
                }
            });
        });
    });

    return roblox;
}

module.exports = initializer;