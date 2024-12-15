import { useClient } from '@/contexts/ClientContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SidePanel, Overlay, setSidePanel, setOverlay } from '@/store/reducer/context';

import Button from './Button';
import Folder from '../icons/Folder';
import Robot from '../icons/Robot';
import Boxes from '../icons/Boxes';
import Layers from '../icons/Layers';
import Settings from '../icons/Settings';
import Logout from '../icons/Logout';

import styles from '@/styles/leftbar.module.css';
    
export default function LeftBar() {
    const { client, ready } = useClient();

    const dispatch = useDispatch();

    const sidePanel = useSelector((state: RootState) => state.context.sidePanel);

    const overlay = useSelector((state: RootState) => state.context.overlay);

    const getHighlightPosition = (): number => {
        switch (sidePanel) {
            case SidePanel.Explorer:
                return 24;
            case SidePanel.Robotics:
                return 70;
            default:
                return 0;
        }
    }

    const handleSidePanel = (panel: SidePanel) => {
        dispatch(setSidePanel(panel));
    }
    
    const handleOverlay = (panel: Overlay) => {
        dispatch(setOverlay(panel));
    }

    const handleLogout = () => {
        if (!client || !ready)
            return;

        client.user.logout();
    }

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.highlight} style={{ top: getHighlightPosition() }}></div>

                <Button className={styles.button} active={sidePanel === SidePanel.Explorer} onClick={() => handleSidePanel(SidePanel.Explorer)}>
                    <Folder className={styles.fill} />
                </Button>

                <Button className={styles.button} active={sidePanel === SidePanel.Robotics} onClick={() => handleSidePanel(SidePanel.Robotics)}>
                    <Robot className={styles.stroke} />
                </Button>

                <Button className={styles.button} active={overlay === Overlay.Cloud} onClick={() => handleOverlay(Overlay.Cloud)}>
                    <Boxes className={styles.stroke} />
                </Button>

                <Button className={styles.button} active={overlay === Overlay.Clients} onClick={() => handleOverlay(Overlay.Clients)}>
                    <Layers className={styles.fill} />
                </Button>
            </div>
            <div className={styles.bottom}>
                <Button className={styles.button} active={overlay === Overlay.Settings} onClick={() => handleOverlay(Overlay.Settings)}>
                    <Settings className={styles.fill} />
                </Button>
                <div className={styles.button} onClick={handleLogout}>
                    <Logout className={styles.stroke} />
                </div>
            </div>
        </div>
    );
}