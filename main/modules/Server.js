const express = require('express');
const cors = require('cors');
const http = require('http');

const api = require('../api');

class Server {
    #port = 0;

    #app = express();

    #server = undefined;

    constructor(port) {
        this.#port = port;

        this.#app.use(express.json());

        this.#app.use(cors());

        this.#app.use('/api', api);

        this.#app.use((err, req, res, next) => {
            let { message, code } = err;

            code = code || 500;

            res.status(code).json({
                message,
                code
            });
        });

        this.#server = http.createServer(this.#app);

        this.#server.listen(this.#port, () => { });
    }

    get port() {
        return this.#port;
    }

    get app() {
        return this.#app;
    }

    get server() {
        return this.#server;
    }
}

module.exports = Server;