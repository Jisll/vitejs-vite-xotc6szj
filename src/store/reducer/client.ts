import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ClientBase {
    id: string;
    name: string;
}

export interface ClientObject {
    process: ClientBase;
    player: ClientBase;
    game: ClientBase;
}

export interface ClientState {
    clients: Record<string, { client: ClientObject, selected: boolean }>;
}

const initialState: ClientState = {
    clients: {}
};

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<any>) => {
            const id = action.payload.process.id;

            state.clients[id] = {
                client: action.payload,
                selected: true
            };
        },
        update: (state, action: PayloadAction<any>) => {
            const id = action.payload.process.id;

            const client = state.clients[id];

            if (!client) return;

            state.clients[id] = {
                client: action.payload,
                selected: client.selected
            };
        },
        toggle: (state, action: PayloadAction<any>) => {
            const id = action.payload;

            const client = state.clients[id];

            if (!client) return;

            state.clients[id] = {
                client: client.client,
                selected: !client.selected
            };
        },
        remove: (state, action: PayloadAction<any>) => {
            delete state.clients[action.payload.process.id];
        }
    },
});

export const { add, update, toggle, remove } = clientSlice.actions;

export default clientSlice.reducer;