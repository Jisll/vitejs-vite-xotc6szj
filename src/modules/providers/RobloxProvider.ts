import Client from '../Client';

export default class RobloxProvider {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(event: string, listener: (data: any) => void): string {
        return this.client.addEventListener('roblox/' + event, listener);
    }

    off(key: string) {
        this.client.removeEventListener(key);
    }

    initialize() {
        this.client.requestAsync('roblox/initialize', undefined);
    }

    execute(clients: string[], textDocument: any) {
        if (!textDocument)
            return;

        if (!textDocument.text || !textDocument.text.length)
            return;

        this.client.requestAsync('roblox/execute', {
            params: {
                clients,
                textDocument
            }
        });
    }

    executeFile(clients: string[]) {
        this.client.requestAsync('roblox/executeFile', {
            params: {
                clients
            }
        });
    }
}