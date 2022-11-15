import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    conversation: null
}


const ConversationSlice = createSlice({
    name: "Conversation",
    initialState,
    reducers: {
        addConversation: (state, action) => {
            state.conversation = action.payload;
        }, addLatestMessage: (state, action) => {
            const con = state.conversation;
            con[action.payload.index].latestMessage = action.payload.latestMessage
            state.conversation = con;
        }
    }
});

export default ConversationSlice.reducer;
export const { addConversation, addLatestMessage } = ConversationSlice.actions;