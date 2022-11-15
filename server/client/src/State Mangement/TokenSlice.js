import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token:null
}


const TokenSlice = createSlice({
    name:"Token",
    initialState,
    reducers:{
        addToken:(state,action) => {
            state.token = action.payload;
        }
    }
});

export default TokenSlice.reducer;
export const {addToken} = TokenSlice.actions;