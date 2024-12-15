import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SidePanel {
    Explorer,
    Robotics
}

export enum Overlay {
    None,
    Cloud,
    Clients,
    Settings,
    Login,
    Register
}

interface ContextState {
    sidePanel: SidePanel;
    overlay: Overlay;
    terminal: boolean;
}

const initialState: ContextState = {
    sidePanel: SidePanel.Explorer,
    overlay: Overlay.Login,
    terminal: true
};

export const contextSlice = createSlice({
    name: 'context',
    initialState,
    reducers: {
        setSidePanel: (state, action: PayloadAction<SidePanel>) => {
            state.sidePanel = action.payload;
        },
        setOverlay: (state, action: PayloadAction<Overlay>) => {
            state.overlay = action.payload
        },
        setTerminal: (state, action: PayloadAction<boolean>) => {
            state.terminal = action.payload;
        }
    }
});

export const { setSidePanel, setOverlay, setTerminal } = contextSlice.actions;

export default contextSlice.reducer;