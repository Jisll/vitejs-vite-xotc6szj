import ApplicationProvider from './providers/ApplicationProvider';
import ConfigurationProvider from './providers/ConfigurationProvider';
import RobloxProvider from './providers/RobloxProvider';
import UserProvider from './providers/UserProvider';
import WorkspaceProvider from './providers/WorkspaceProvider';

export default class Client {
    port: number;

    capabilities: string[] = [];

    server?: WebSocket;

    listeners: Map<string, (data: any) => void> = new Map();

    application: ApplicationProvider;

    configuration: ConfigurationProvider;

    roblox: RobloxProvider;

    user: UserProvider;

    workspace: WorkspaceProvider;

    onMessage: (message: string, code: number) => void = () => {};

    constructor(port: number, capabilities: string[] = []) {
        this.port = port;

        this.capabilities = capabilities;

        this.application = new ApplicationProvider(this);

        this.configuration = new ConfigurationProvider(this);

        this.roblox = new RobloxProvider(this);

        this.user = new UserProvider(this);

        this.workspace = new WorkspaceProvider(this);
    }

    onMessageAsync(callback: (message: string, code: number) => void) {
        this.onMessage = callback;
    }

    initialize() {
        this.server = new WebSocket(`ws://localhost:${this.port}`);

        this.server.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.hasOwnProperty('message') && data.hasOwnProperty('code')) {
                const { message, code } = data;

                this.onMessage(message, code);
            } else {
                const listeners = Array.from(this.listeners);

                for (const [key, listener] of listeners) {
                    if (key.startsWith(data.provider)) {
                        listener(data.data);
                    }
                }
            }
        }

        this.server.onopen = () => {
            // @ts-ignore
            this.server.send(JSON.stringify({
                capabilities: this.capabilities
            }));
        }
    }

    requestAsync(provider: string, data: any) {
        if (!this.server)
            throw new Error('The client has not been initialized.');

        if (this.server.readyState !== WebSocket.OPEN)
            throw new Error('The client is not connected to the server.');

        this.server.send(JSON.stringify({
            provider,
            data
        }));
    }

    addEventListener(event: string, listener: (data: any) => void): string {
        const key = `${event}-${Math.random()}`;

        this.listeners.set(key, listener);
        return key;
    }

    removeEventListener(key: string) {
        this.listeners.delete(key);
    }
}