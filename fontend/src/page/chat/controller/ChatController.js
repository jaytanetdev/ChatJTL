// ChatController.js

import { useSelector, useDispatch } from 'react-redux';
import { setMessageToSend, selectMessageToSend } from '../../../redux/store/features/chat/chatSlice';
import { selectRoomId } from '../../../redux/store/features/navbar/navbarSlice';
import { callApi } from '../../../service/api';
import Cookies from 'js-cookie';
export const useChatController = () => {

    const inputMessage = useSelector(selectMessageToSend);
    const roomId = useSelector(selectRoomId);
    const dispatch = useDispatch();
    const sendMessage = async () => {
        const userId = Cookies.get('_id');

        if (inputMessage) {
            await callApi("POST", "/api/ins/ChatMassage", { message: inputMessage, roomId: roomId, sendByUserId: userId });
            dispatch(setMessageToSend(''));
        }
    };

    const handleInputChange = (e) => {
        dispatch(setMessageToSend(e.target.value));
    };

    return { inputMessage, sendMessage, handleInputChange }; // Return inputMessage along with other functions
};
