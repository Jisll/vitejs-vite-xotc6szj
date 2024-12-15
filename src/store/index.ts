import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import cloudReducer from './reducer/cloud';
import clientReducer from './reducer/client';
import contextReducer from './reducer/context';
import workspaceReducer from './reducer/workspace';

enableMapSet();

export const store = configureStore({
    reducer: {
        cloud: cloudReducer,
        client: clientReducer,
        context: contextReducer,
        workspace: workspaceReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;