import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    index:null
}


const IndexSlice = createSlice({
    name: "Index",
    initialState,
    reducers: {
        addIndex: (state, action) => {
            state.index= action.payload;
        }
    }
});

export default IndexSlice.reducer;
export const {addIndex} = IndexSlice.actions;