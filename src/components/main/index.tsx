import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SidePanel } from '@/store/reducer/context';
import { Allotment, AllotmentHandle, LayoutPriority } from 'allotment';

import Explorer from './Explorer';
import Robotics from './Robotics';
import Terminal from './Terminal';

import styles from '@/styles/main.module.css';
import { useEffect } from 'react';
import Editor from '../Editor';

export default function Main() {
    const ref = useRef<AllotmentHandle>(null);

    const sidePanel = useSelector((state: RootState) => state.context.sidePanel);

    const terminal = useSelector((state: RootState) => state.context.terminal);

    useEffect(() => {        
        ref.current?.reset();
    }, [terminal]);

    return (
        <Allotment proportionalLayout={false}>
            <Allotment.Pane minSize={170} preferredSize={170} snap>
                <div className={styles.left}>
                    {sidePanel === SidePanel.Explorer && <Explorer />}
                    {sidePanel === SidePanel.Robotics && <Robotics />}
                </div>
            </Allotment.Pane>
            <Allotment.Pane minSize={240} priority={LayoutPriority.High}>
                <Allotment ref={ref} vertical>
                    <Allotment.Pane minSize={120}>
                        <Editor />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={120} preferredSize={120} visible={terminal} snap>
                        <Terminal />
                    </Allotment.Pane>
                </Allotment>
            </Allotment.Pane>
        </Allotment>
    );
}