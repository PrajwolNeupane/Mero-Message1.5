import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './State Mangement/UserSlice.js';
import ConversationSlice from './State Mangement/ConversationSlice.js';
import TokenSlice from './State Mangement/TokenSlice.js';
import IndexSlice from './State Mangement/IndexSlice.js';
import MessageSlice from './State Mangement/MessageSlice.js';

export const Store = configureStore({
    reducer: {
        User: UserSlice,
        Token: TokenSlice,
        Conversation: ConversationSlice,
        Index: IndexSlice,
        Message: MessageSlice
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})