import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useClient } from '@/contexts/ClientContext';
import { setTerminal } from '@/store/reducer/context';

import Image from 'next/image';

// import File from './File';
import Edit from './Edit';
import View from './View';
import Maximize from '../icons/Maximize';
import Exit from '../icons/Exit';

import styles from '@/styles/topbar.module.css';


export default function TopBar() {
    const dispatch = useDispatch();

    const terminal = useSelector((state: RootState) => state.context.terminal);

    const { client, ready } = useClient();

    const handleTerminal = () => {
        dispatch(setTerminal(!terminal));
    }

    const handleMinimize = () => {
        if (!client || !ready)
            return;

        client.application.minimize();
    }

    const handleMaximize = () => {
        if (!client || !ready)
            return;

        client.application.maximize();
    }

    const handleExit = () => {
        if (!client || !ready)
            return;

        client.application.exit();
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <Image height={24} width={24} src={'Wave-Blue.ico'} alt='Wave'/>
                <div className={styles.controls}>
                    {/* <File /> */}
                    <Edit />
                    <View />
                    <div className={styles.terminal} onClick={handleTerminal}>Terminal</div>
                </div>
            </div>
            <div className={styles.windowTitle}>Wave - v2.9.1a</div>
            <div className={styles.windowOptions}>
                <div className={styles.button} onClick={handleMinimize}>
                    <div className={styles.minimize}></div>
                </div>
                <div className={styles.button} onClick={handleMaximize}>
                    <Maximize className={styles.maximize}/>
                </div>
                <div className={styles.button} onClick={handleExit}>
                    <Exit className={styles.exit}/>
                </div>
            </div>
        </div>
    );
}