const Provider = require('../modules/Provider');
const WinReg = require('winreg');

const { spawn } = require('child_process');

const key = new WinReg({
    hive: WinReg.HKCU,
    key: '\\Software\\KasperskyLab',
});

const GetSession = () => {
    return new Promise((resolve, reject) => {
        key.get('Session', (err, item) => {
            if (err)
                return reject(err);

            resolve(item ? item.value : '');
        });
    });
}

const SetSession = (session) => {
    return new Promise((resolve, reject) => {
        key.create(err => {
            if (err)
                return reject(err);

            key.set('Session', WinReg.REG_SZ, session, err => {
                if (err)
                    return reject(err);

                resolve();
            });
        });
    });
}

const initializer = (server) => {
    const user = new Provider('user', server);

    const getUserAsync = async (token) => {
        const response = await fetch('https://api.getwave.gg/v1/user', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        const json = await response.json();

        if (response.status === 429 || response.status !== 200)
            throw new Error(response.status === 429 ? 'You have exceeded the rate limit of requests. Please try again later.' : json.userFacingMessage);

        return json;
    }

    user.registerFeature('try-login', async () => {
        try {
            const session = await GetSession();

            if (!session)
                return;

            const currentUser = await getUserAsync(session);

            user.sendResponse('login', currentUser);

            user.setVariable('token', session);
        } catch (err) {
            return;
        }
    });

    user.registerFeature('login', async data => {

        var response = await fetch('https://api.getwave.gg/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identity: data.params.identity,
                password: data.params.password
            })
        });

        const json = await response.json();

        if (response.status === 429) {
            user.sendResponse('api-error', {
                message: 'You have exceeded the rate limit of requests. Please try again later.',
            });
            return;
        } else if (!response.ok) {
            user.sendResponse('api-error', {
                message: json.userFacingMessage || 'An unexpected error occurred. Please try again later.',
            });
            if (json.code === "session#0002")
            {
                const response2 = await fetch('https://api.getwave.gg/v1/auth/email/request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identity: data.params.identity
                    }),
                });
            }
            return;
        }

        const token = response.headers.get('authorization');

        const currentUser = await getUserAsync(token);

        await SetSession(`\"${token}\"`);

        user.sendResponse('login', currentUser);

        user.setVariable('token', token);
    });

    user.registerFeature('register', async (data) => {
        try {
            const response = await fetch('https://api.getwave.gg/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.params.username,
                    email: data.params.email,
                    password: data.params.password,
                }),
            });
    
            // Parse the response as JSON
            const json = await response.json();
    
            // Handle non-200 responses or rate-limiting
            if (response.status === 429) {
                user.sendResponse('api-error', {
                    message: 'You have exceeded the rate limit of requests. Please try again later.',
                });
                return;
            } else if (!response.ok) {
                user.sendResponse('api-error', {
                    message: json.userFacingMessage || 'An unexpected error occurred. Please try again later.',
                });
                return;
            }
            
            const response2 = await fetch('https://api.getwave.gg/v1/auth/email/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identity: data.params.username
                }),
            });

            // Successful registration
            user.sendResponse('register', {
                message: 'Registration successful! Please check your email for verification.',
            });
        } catch (error) {
            // Handle network or other unexpected errors
            user.sendResponse('api-error', {
                message: 'Failed to register. Please check your internet connection or try again later.',
            });
        }
    });

    user.registerFeature('redeem-license', async data => {
        const token = user.getVariable('token');

        if (!token) {
            user.sendResponse('api-error', {
                message: 'You must be logged in to redeem a license.'
            });

            return;
        }

        const licenseKey = data.params.license;

        var response = await fetch('https://api.getwave.gg/v1/subscription/claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                licenseKey
            })
        });

        const json = await response.json();

        if (response.status === 429) {
            user.sendResponse('api-error', {
                message: 'You have exceeded the rate limit of requests. Please try again later.',
            });
            return;
        } else if (!response.ok) {
            user.sendResponse('api-error', {
                message: json.userFacingMessage || 'An unexpected error occurred. Please try again later.',
            });
            return;
        }

        const currentUser = await getUserAsync(token);

        user.sendResponse('redeem-license', currentUser);
    });

    user.registerFeature('freemium', async data => {
        console.log('Opening browser...');

        spawn('cmd', ['/c', 'start', 'https://key.getwave.gg']);
    });

    user.registerFeature('forgot-password', async data => {
        var response = await fetch('https://api.getwave.gg/v1/auth/password/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                identity: data.params.identity
            })
        });

        const json = await response.json();

        if (response.status === 429) {
            user.sendResponse('api-error', {
                message: 'You have exceeded the rate limit of requests. Please try again later.',
            });
            return;
        } else if (!response.ok) {
            user.sendResponse('api-error', {
                message: json.userFacingMessage || 'An unexpected error occurred. Please try again later.',
            });
            return;
        }

        user.sendResponse('forgot-password', undefined);
    });

    user.registerFeature('logout', async () => {
        await SetSession('\"\"');

        user.sendResponse('logout', undefined);

        user.setVariable('token', undefined);
    });

    return user;
}

module.exports = initializer;