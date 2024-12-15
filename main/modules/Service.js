const ws = require('ws');

const tryJsonParse = (data) => {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

class Service {
    #server = undefined;

    #providers = [];

    clients = [];

    constructor(server) {
        this.#server = new ws.Server({ server: server });

        this.#server.on('connection', socket => {
            socket.json = (data) => socket.send(JSON.stringify(data));

            socket.status = (message, code) => socket.json({ message, code });

            socket.on('message', message => {
                const data = tryJsonParse(message);

                if (!data)
                    return socket.close();

                if (!this.clients.find(c => c.socket === socket)) {
                    const capabilities = data.capabilities;
                    
                    if (!capabilities || !Array.isArray(capabilities))
                        return socket.status('Invalid server capabilities', 400);

                    if (capabilities.some(p => typeof p !== 'string'))
                        return socket.status('Invalid server capabilities', 400);
                    
                    for (const capability of capabilities) {
                        if (!this.#providers.find(p => p.name === capability))
                            return socket.status(`Server does not support the capability \"${capability}\"`, 400);
                    }

                    this.clients.push({ socket, capabilities });

                    socket.status('OK', 200);
                } else {
                    let [provider, feature] = data.provider.split('/');

                    const client = this.clients.find(c => c.socket === socket);

                    if (!client.capabilities.includes(provider))
                        return socket.status(`Client does not support the capability \"${data.provider}\"`, 400);

                    provider = this.#providers.find(p => p.name === provider);

                    if (!provider)
                        return socket.status(`Server does not support the capability \"${provider}\"`, 400);

                    feature = provider.getFeature(feature);

                    if (!feature)
                        return socket.status(`Server does not support the feature \"${data.provider}\"`, 400);

                    feature.handler(data.data);
                }
            });
        });
    }

    registerServiceProvider(initializer) {
        const provider = initializer(this);

        if (!provider)
            return;

        if (this.#providers.find(p => p.name === provider.name))
            return;

        this.#providers.push(provider);
    }
}

module.exports = Service;