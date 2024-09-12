// features/counter/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    nameChat: '',
    messages: [],
    messageToSend: '',
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setNameChat: (state, action) => {
            state.nameChat = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessageToSend: (state, action) => {
            state.messageToSend = action.payload;
        },
        clearMessageToSend: (state) => {
            state.messageToSend = '';
        },
        updateMessageReadStatus: (state, action) => {
            const { _id } = action.payload;
            const message = state.messages.find(msg => msg._id === _id);
          
            if (message) {
                message.read = true;
            } 
        },
    },
});

export const {
    setMessages,
    addMessage,
    setMessageToSend,
    clearMessageToSend,
    setNameChat,
    updateMessageReadStatus
} = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;
export const selectMessageToSend = (state) => state.chat.messageToSend;
export const selectNameChat = (state) => state.chat.nameChat;

export default chatSlice.reducer;
