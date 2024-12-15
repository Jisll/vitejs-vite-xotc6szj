import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Overlay as OverlayType, setOverlay } from '@/store/reducer/context';

import Cloud from './Cloud';
import Clients from './Clients';
import Settings from './Settings';
import Login from './Login';
import Register from './Register';

import styles from '@/styles/overlay.module.css';

export default function Overlay() {
    const elementRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const overlay = useSelector((state: RootState) => state.context.overlay);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (overlay === OverlayType.None || overlay === OverlayType.Login || overlay === OverlayType.Register)
            return;

        if (elementRef.current && elementRef.current.contains(event.target as Node))
            return;

        dispatch(setOverlay(OverlayType.None));
    }

    return (
        <div className={`${styles.container} ${overlay !== OverlayType.None ? styles.active : ''}`} onClick={handleClick}>
            <div ref={elementRef}>
                <Cloud className={`${styles.overlay} ${overlay === OverlayType.Cloud ? styles.active : ''}`}/>
                <Clients className={`${styles.overlay} ${overlay === OverlayType.Clients ? styles.active : ''}`}/>
                <Settings className={`${styles.overlay} ${overlay === OverlayType.Settings ? styles.active : ''}`}/>
                <Login visible={overlay === OverlayType.Login}/>
                <Register visible={overlay === OverlayType.Register}/>
            </div>
        </div>
    )
}