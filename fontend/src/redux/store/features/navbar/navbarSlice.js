// features/counter/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: [],
    roomId: "",
    sliceNav: true,

};

export const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            state.user = action.payload;
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },
        setSliceNav: (state, action) => {
            state.sliceNav = action.payload;
        },

    },
});

export const {
    setUserData,
    setRoomId,
    setSliceNav,
    setCountNoReadChat
} = navbarSlice.actions;

export const selectUserData = (state) => state.navbar.user;
export const selectRoomId = (state) => state.navbar.roomId;
export const selectSliceNav = (state) => state.navbar.sliceNav;



export default navbarSlice.reducer;
