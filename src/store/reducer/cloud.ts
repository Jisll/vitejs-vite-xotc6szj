import type { FetchResult, SearchResult } from '@/api/scriptBlox';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CloudState {
    result: FetchResult | SearchResult;
}

const initialState: CloudState = {
    result: {
        totalPages: 0,
        nextPage: 0,
        max: 0,
        scripts: []
    }
};

export const cloudSlice = createSlice({
    name: 'cloud',
    initialState,
    reducers: {
        set: (state, action: PayloadAction<FetchResult | SearchResult>) => {
            state.result = action.payload;
        }
    },
});

export const { set } = cloudSlice.actions;

export default cloudSlice.reducer;