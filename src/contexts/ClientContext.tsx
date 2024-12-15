import { createContext , useState, useEffect, useContext } from 'react';
import Client from '@/modules/Client';
import { toast } from 'react-toastify';

interface Context {
    client: Client | null;
    ready: boolean;
}

const ClientContext = createContext<Context>({ client: null, ready: false });

export const ClientProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [client, setClient] = useState<Client | null>(null);

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        const client = new Client(45624, [
                'application',
                'configuration',
                'roblox',
                'user',
                'workspace'
            ]
        );

        client.onMessageAsync((message, code) => {
            if (code !== 200)
                toast.error(message);
            else
                setReady(true);
        });

        client.initialize();

        setClient(client);

        return () => {
            client.server?.close();
        };
    }, []);

    return (
        <ClientContext.Provider value={{ client, ready }}>
            {children}
        </ClientContext.Provider>
    );
}

export const useClient = () => {
    return useContext(ClientContext);
}