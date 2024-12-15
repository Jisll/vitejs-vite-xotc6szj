const Provider = require('../modules/Provider');
const { dialog } = require('electron');

const { join } = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const { freemem } = require('os');

const defaultConfiguration = async () => {
    return {
        configuration: {
            instance: {
                cpu: {
                    max: 100
                },
                memory: {
                    max: 524288
                }
            },
            editor: {
                fontSize: 14,
                minimap: {
                    enabled: true,
                    position: 1
                },
                inlayHints: true
            }
        }
    };
}   

const initializer = (server) => {
    const configuration = new Provider('configuration', server);

    const bin = join(process.cwd(), 'bin');

    configuration.registerFeature('initialize', async () => {
        const interval = configuration.getVariable('interval');

        if (!existsSync(bin))
            mkdirSync(bin);

        if (!existsSync(join(bin, 'config.json')))
            writeFileSync(join(bin, 'config.json'), JSON.stringify(await defaultConfiguration(), null, 4)); 

        const config = require(join(bin, 'config.json'));

        interval && clearInterval(interval);

        configuration.setVariable('interval', setInterval(() => {
            configuration.sendResponse('available-memory', {
                data: freemem() / (1024 * 1024)
            });
        }, 5000));

        configuration.sendResponse('initialized', {
                data: config
            }
        );

        configuration.sendResponse('available-memory', {
            data: freemem() / (1024 * 1024)
        });

        configuration.setVariable('configuration', config);
    });

    configuration.registerFeature('set-cpu-max', async data => {
        const config = configuration.getVariable('configuration');

        config.configuration.instance.cpu.max = data.params.value;

        writeFileSync(join(bin, 'config.json'), JSON.stringify(config, null, 4));

        configuration.setVariable('configuration', config);
    });

    configuration.registerFeature('set-memory-max', async data => {
        const config = configuration.getVariable('configuration');

        config.configuration.instance.memory.max = data.params.value;

        writeFileSync(join(bin, 'config.json'), JSON.stringify(config, null, 4));

        configuration.setVariable('configuration', config);
    });

    return configuration;
}

module.exports = initializer;