import { ForwardRefRenderFunction, useState, useRef, useImperativeHandle, useEffect, forwardRef } from 'react';

import { Tab } from '@/store/reducer/workspace';
import TabItem from '@/components/Tab/Item';

import styles from '@/styles/tabs.module.css';

export interface TabListHandle {
    selectedIndex: number;

    selectTab: (tab: Tab) => void;
}

interface TabListProps {
    items: Tab[];

    OnSelectionChange: (tab: Tab) => void;
    OnSelectionClose: (tab: Tab) => void;
}

const TabList: ForwardRefRenderFunction<TabListHandle, TabListProps> = ({ items, OnSelectionChange, OnSelectionClose }, ref) => {    
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const elementRef = useRef<HTMLDivElement>(null);

    const scrollToTab = (index: number) => {
        if (!elementRef.current)
            return;

        const tab = elementRef.current.children[index] as HTMLElement;

        elementRef.current.scrollTo({
            left: tab.offsetLeft,
            behavior: 'smooth'
        });
    }

    useImperativeHandle(ref, () => ({
        selectedIndex,
        selectTab: (tab: Tab) => {
            const index = items.findIndex(item => item.uri === tab.uri);

            if (index === -1)
                return;

            setSelectedIndex(index);

            scrollToTab(index);

            OnSelectionChange(tab);
        }
    }));

    useEffect(() => {
        if (!elementRef.current)
            return; 

        const observer = new MutationObserver(() => {
            if (!elementRef.current)
                return;

            elementRef.current.scrollTo({
                left: elementRef.current.scrollWidth,
                behavior: 'smooth'
            });
        });

        elementRef.current.addEventListener('wheel', (event: WheelEvent) => {
            event.preventDefault();

            if (!elementRef.current)
                return;

            if (event.deltaY === 0)
                return;
            
            elementRef.current.scrollLeft += event.deltaY;
        });

        observer.observe(elementRef.current, { childList: true });

        return () => {
            observer.disconnect();
        }
    }, []);

    useEffect(() => {
        if (items.length === 0)
            return;

        setSelectedIndex(items.length - 1);

        OnSelectionChange(items[items.length - 1]);
    }, [items]);
    
    return (
        <div ref={elementRef} className={styles.container}>
            {
                items && items.map((item, index) => (
                    <TabItem 
                        key={index}
                        header={item.name}
                        subHeader={item.parent}
                        deleted={item.deleted}
                        selected={selectedIndex === index}
                        onClick={() => {
                            setSelectedIndex(index);

                            scrollToTab(index);

                            OnSelectionChange(item);
                        }}
                        onClose={() => {
                            setSelectedIndex(index);

                            OnSelectionClose(item);
                        }}/>
                ))
            }
        </div>
    );
}

export default forwardRef(TabList);