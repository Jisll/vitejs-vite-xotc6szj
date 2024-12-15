import Client from '../Client';

export default class ConfigurationProvider {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(event: string, listener: (data: any) => void): string {
        return this.client.addEventListener('configuration/' + event, listener);
    }

    off(key: string) {
        this.client.removeEventListener(key);
    }

    initialize() {
        this.client.requestAsync('configuration/initialize', undefined);
    }

    setCpuMax(value: number) {
        this.client.requestAsync('configuration/set-cpu-max', {
            params: {
                value
            }
        });
    }

    setRamMax(value: number) {
        this.client.requestAsync('configuration/set-memory-max', {
            params: {
                value
            }
        });
    }

    availableCpu() {
        this.client.requestAsync('configuration/available-cpu', undefined);
    }

    availableMemory() {
        this.client.requestAsync('configuration/available-memory', undefined);
    }
}