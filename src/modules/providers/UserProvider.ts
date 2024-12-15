import Client from '../Client';

export default class UserProvider {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    on(event: string, listener: (data: any) => void): string {
        return this.client.addEventListener('user/' + event, listener);
    }
    
    off(key: string) {
        this.client.removeEventListener(key);
    }

    login(identity: string, password: string) {
        this.client.requestAsync('user/login', {
            params: {
                identity,
                password
            }
        });
    }

    register(username: string, email: string, password: string) {
        this.client.requestAsync('user/register', {
            params: {
                username,
                email,
                password
            }
        });
    }

    redeem(license: string) {
        this.client.requestAsync('user/redeem-license', {
            params: {
                license
            }
        });
    }

    freemium() {
        this.client.requestAsync('user/freemium', undefined);
    }

    forgotPassword(identity: string) {
        this.client.requestAsync('user/forgot-password', {
            params: {
                identity
            }
        });
    }

    tryLogin() {
        this.client.requestAsync('user/try-login', undefined);
    }

    logout() {
        this.client.requestAsync('user/logout', undefined);
    }
}