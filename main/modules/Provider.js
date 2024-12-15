class Provider {
    name = '';

    #server = undefined;

    #features = [];

    #variables = {};

    constructor(name, server) {
        this.name = name;

        this.#server = server;
    }

    sendResponse(name, data) {
        this.#server.clients.forEach(({ socket, capabilities }) => {
            if (!capabilities.includes(this.name))
                return;
            
            socket.json({
                provider: `${this.name}/${name}`,
                data
            });
        });
    }

    registerFeature(name, handler) {
        this.#features.push({ name, handler });
    }

    getFeature(name) {
        return this.#features.find(f => f.name === name);
    }

    setVariable(key, value) {
        this.#variables[key] = value;
    }

    getVariable(key) {
        return this.#variables[key];
    }

    removeVariable(key) {
        delete this.#variables[key];
    }
}

module.exports = Provider;