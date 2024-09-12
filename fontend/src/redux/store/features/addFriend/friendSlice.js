import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    friend: [],
    countRF: 0
};

export const addFriend = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setFriend: (state, action) => {
            state.friend = action.payload;
        },
        setCountRF: (state, action) => {
            state.countRF = action.payload;
        },
    },
});

export const {
    setFriend,
    setCountRF
} = addFriend.actions;

export const selectFriend = (state) => state.friend.friend;
export const selectCountRF = (state) => state.friend.countRF;

export default addFriend.reducer;
