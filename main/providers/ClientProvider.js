const Provider = require('../modules/Provider');

const initializer = (server) => {
    const client = new Provider('client', server);

    const clients = [];

    client.registerFeature('handshake', data => {

    });
}

module.exports = initializer;