const { InitializeRequest } = require('vscode-languageserver');

const IsRequest = (message) => {
    return message.method == InitializeRequest.type.method;
}

module.exports = IsRequest;