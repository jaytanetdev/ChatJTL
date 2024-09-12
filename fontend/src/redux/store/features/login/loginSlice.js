// features/counter/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {

    username: "",
    password: "",
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
    },
});

export const {
    setUsername,
    setPassword
} = loginSlice.actions;

export const selectUsername = (state) => state.login.username;
export const selectPassword = (state) => state.login.password;

export default loginSlice.reducer;
