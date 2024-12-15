import React, { createContext, useRef, useContext } from 'react';

import { MonacoComponentHandle } from '@/components/Editor/Monaco';

const MonacoContext = createContext<React.RefObject<MonacoComponentHandle> | null>(null);

export const MonacoProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const ref = useRef<MonacoComponentHandle>(null);

    return (
        <MonacoContext.Provider value={ref}>
            {children}
        </MonacoContext.Provider>
    );
}

export const useMonaco = () => {
    return useContext(MonacoContext);
}