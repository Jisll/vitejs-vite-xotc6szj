const Provider  = require('../modules/Provider');

const initializer = (window) => {
    return (server) => {
        const application = new Provider('application', server);

        application.registerFeature('exit', () => {
            window.close();
        });

        application.registerFeature('minimize', () => {
            window.minimize();
        });

        application.registerFeature('maximize', () => {
            if (window.isMaximized())
                window.unmaximize();
            else
                window.maximize();
        });

        return application;
    }
}

module.exports = initializer;