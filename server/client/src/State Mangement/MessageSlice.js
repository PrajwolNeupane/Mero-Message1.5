import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    message: null
}


const MessageSlice = createSlice({
    name: "Message",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.message = action.payload;
        }
    }
});

export default MessageSlice.reducer;
export const {addMessage} = MessageSlice.actions;