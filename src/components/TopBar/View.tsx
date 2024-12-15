import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SidePanel, Overlay, setSidePanel, setOverlay, setTerminal } from '@/store/reducer/context';

import ContextButton from '../Context/Button';
import { ContextMenuItem, ContextMenuSeparator } from '@/components/Context/Menu';

import styles from '@/styles/topbar.module.css';

export default function View() {
    const dispatch = useDispatch();

    const terminal = useSelector((state: RootState) => state.context.terminal);

    const handleSidePanel = (sidePanel: SidePanel) => {
        dispatch(setSidePanel(sidePanel));   
    }

    const handleOverlay = (overlay: Overlay) => {
        dispatch(setOverlay(overlay));
    }

    const handleTerminal = () => {
        dispatch(setTerminal(!terminal));
    }

    return (
        <ContextButton className={styles.view} title='View'>
            <ContextMenuItem title='Explorer' onClick={() => handleSidePanel(SidePanel.Explorer)}/>
            <ContextMenuItem title='Robotics' onClick={() => handleSidePanel(SidePanel.Robotics)}/>
            <ContextMenuItem title='Script Cloud' onClick={() => handleOverlay(Overlay.Cloud)}/>
            <ContextMenuItem title='Client Manager' onClick={() => handleOverlay(Overlay.Clients)}/>

            <ContextMenuSeparator />
            
            <ContextMenuItem title='Terminal' onClick={handleTerminal}/>
        </ContextButton>
    );
}