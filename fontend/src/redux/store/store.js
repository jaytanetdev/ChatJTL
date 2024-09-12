// store.js

import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './features/chat/chatSlice'; // Adjust the path as per your project structure
import navbarReducer from './features/navbar/navbarSlice'; // Adjust the path as per your project structure
import loginReducer from './features/login/loginSlice'; // Adjust the path as per your project structure
import friendReducer from './features/addFriend/friendSlice'; // Adjust the path as per your project structure
import registerReducer from './features/register/registerSlice'; // Adjust the path as per your project structure

export default configureStore({
    reducer: {
        chat: chatReducer,
        navbar: navbarReducer,
        login: loginReducer,
        friend: friendReducer,
        register: registerReducer
    },
});
