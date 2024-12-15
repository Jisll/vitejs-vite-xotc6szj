import Client from '../Client';

export default class ApplicationProvider {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(event: string, listener: (data: any) => void): string {
        return this.client.addEventListener('application/' + event, listener);
    }

    off(key: string) {
        this.client.removeEventListener(key);
    }

    logout() {
        this.client.requestAsync('application/logout', null);
    }

    exit() {
        this.client.requestAsync('application/exit', null);
    }

    minimize() {
        this.client.requestAsync('application/minimize', null);
    }

    maximize() {
        this.client.requestAsync('application/maximize', null);
    }
}