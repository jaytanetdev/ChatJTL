import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: "",
    password: "",
    name: "",
    lastname: "",
    imageMeta: {}, // Store only metadata, not the File object
};

export const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setNmae: (state, action) => {
            state.name = action.payload;
        },
        setLastname: (state, action) => {
            state.lastname = action.payload;
        },
        setImageMeta: (state, action) => {
            state.imageMeta = action.payload;
        },
    },
});

export const {
    setUsername,
    setPassword,
    setNmae,
    setLastname,
    setImageMeta
} = registerSlice.actions;

export const selectUsername = (state) => state.register.username;
export const selectPassword = (state) => state.register.password;
export const selectName = (state) => state.register.name;
export const selectLastname = (state) => state.register.lastname;
export const selectImageMeta = (state) => state.register.imageMeta;

export default registerSlice.reducer;
