import { useClient } from '@/contexts/ClientContext';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setFiles } from '@/store/reducer/workspace';
import { set as setCloud } from '@/store/reducer/cloud';
import { add, update, remove } from '@/store/reducer/client';

import scriptBlox from '@/api/scriptBlox';
import { toast } from 'react-toastify';

import LeftBar from '@/components/LeftBar';
import TopBar from '@/components/TopBar';
import Main from '@/components/main';
import Overlay from '@/components/Overlay';

export default function Home() {
    const { client, ready } = useClient();

    const dispatch = useDispatch();

    useEffect(() => {
        if (!client || !ready)
            return;

        client.workspace.on('initialized', data => {
            client.roblox.initialize();

            dispatch(
                setFiles(
                    data.data
                )
            );
        });

        client.roblox.on('client/identify', data => {
            dispatch(
                add(
                    data.client
                )
            );
        });

        client.roblox.on('client/update', data => {
            dispatch(
                update(
                    data.client
                )
            );
        });

        client.roblox.on('client/disconnect', data => {
            dispatch(
                remove(
                    data.client
                )
            );
        });

        client.roblox.on('client/error', data => {
            toast.error(data.message.error_message);
        });

        client.workspace.initialize('scripts');
    }, [client, ready]);

    useEffect(() => {
        toast.info('Checking for updates, may take a few seconds...');
        
        scriptBlox.fetchAsync(1)
            .then(data => {                
                dispatch(
                    setCloud(
                        data.result
                    )
                )
            })
            .catch(() => toast.error("Couldn't retrieve the script database from our servers."));
    }, []);

    return (
        <>
            <TopBar/>
            <main>
                <LeftBar/>
                <Main/>
            </main>
            <Overlay/>
        </>
    );
}