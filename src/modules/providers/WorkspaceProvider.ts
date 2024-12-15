import Client from '../Client';

export default class WorkspaceProvider {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(event: string, listener: (data: any) => void): string {
        return this.client.addEventListener('workspace/' + event, listener);
    }

    off(key: string) {
        this.client.removeEventListener(key);
    }

    initialize(workspace: string) {
        this.client.requestAsync('workspace/initialize', {
            params: {
                workspace
            }
        });
    }

    openTextDocument(uri: string | null) {
        this.client.requestAsync('workspace/openTextDocument', {
            params: {
                textDocument: {
                    uri
                }
            }
        });
    }

    closeTextDocument(uri: string) {
        this.client.requestAsync('workspace/closeTextDocument', {
            params: {
                textDocument: {
                    uri
                }
            }
        });
    }

    saveTextDocument(uri: string, text: string) {
        this.client.requestAsync('workspace/saveTextDocument', {
            params: {
                textDocument: {
                    uri,
                    text
                }
            }
        });
    }

    createTextDocument(uri: string, text: string) {
        this.client.requestAsync('workspace/createTextDocument', {
            params: {
                textDocument: {
                    uri,
                    text
                }
            }
        });
    }
}