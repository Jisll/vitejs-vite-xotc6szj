const { watch, existsSync, lstatSync } = require('fs');
const { join } = require('path');
const { getWorkspace, pathToJson } = require('../helpers/WorkspaceHelper');

const EventEmitter = require('events');

class Watcher {
    path = undefined;

    watcher = undefined;

    emitter = new EventEmitter();

    constructor(path) {
        this.path = path;

        this.watcher = watch(path, {
            recursive: true,
            persistent: true
        }, (event, fileName) => {
            const filePath = join(path, fileName);
            
            switch (event) {
                case 'rename': {
                    if (existsSync(filePath)) {
                        const isDirectory = lstatSync(filePath).isDirectory();

                        const data = pathToJson(fileName, isDirectory ? getWorkspace(path, filePath) : undefined);

                        this.emitter.emit('item/added', data);
                    } else {
                        const data = pathToJson(fileName);

                        this.emitter.emit('item/removed', data);
                    }

                    break;
                }
                case 'change': {
                    const isDirectory = lstatSync(filePath).isDirectory();

                    if (isDirectory) 
                        return;

                    const data = pathToJson(fileName);

                    this.emitter.emit('item/changed', data);

                    break;
                }
            }
        });
    }

    on(event, listener) {
        this.emitter.on(event, listener);
    }

    close() {
        this.watcher.close();
    }
}

module.exports = Watcher;