import React, { useEffect, useRef ,useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, selectMessages, addMessage, selectNameChat, updateMessageReadStatus } from '../../../redux/store/features/chat/chatSlice';
import { useChatController } from '../controller/ChatController';
import io from 'socket.io-client';
import { callApi } from '../../../service/api';
import './Chatcss.css';
import moment from 'moment';
import Navbar from '../../../components/Navbar/Navbar';
import { selectRoomId, setRoomId,setSliceNav, selectSliceNav } from '../../../redux/store/features/navbar/navbarSlice';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const socket = io(import.meta.env.VITE_API);
const ChatUi = () => {
    const userId = Cookies.get('_id');

    const messages = useSelector(selectMessages);
    const roomId = useSelector(selectRoomId);
    const sliceNav = useSelector(selectSliceNav);
    const nameChat = useSelector(selectNameChat);
    const { inputMessage, sendMessage, handleInputChange } = useChatController();
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null); // useRef for chat-messages div


    
    useEffect(() => {

        socket.on('message_chats', (data) => {

            const clickRoomId = Cookies.get('clickRoomId');
            if (data.roomId === clickRoomId) {
                dispatch(addMessage(data));
            }
        });
        socket.on('readMessage', (data) => {
            if (data.roomId === roomId) {
                const messageId = data._id._id || data._id; // Adjust to get the actual _id value
                dispatch(updateMessageReadStatus({ _id: messageId }));
            }
        });

        return () => {
            socket.off('message_chats');
            socket.off('readMessage');
        };
    }, [roomId, dispatch]);

    useEffect(() => {
        if (roomId) {
            fetchData();
        }
    }, [roomId]);

    const fetchData = async () => {
        try {
            const resChat = await callApi("GET", `/api/get/ChatMassage/${roomId}`, {});
            dispatch(setMessages(resChat.data));
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    useEffect(() => {
        if (roomId) {
            scrollToBottom();
        }
    }, [messages])

    const scrollToBottom = () => {
        // Scroll to the bottom of chat-messages div
        const chatContainer = document.querySelector('.chat-messages');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };


    return (
        <>
            <div style={{ display: 'flex', width: "100vw" }}>
                <Navbar />
                    {console.log("render",roomId)}
                {roomId ? <div className="chat-container">
                    <div className="chat-header">
                        <span className={sliceNav ? "" : 'menu-icon'} onClick={() => {
                            dispatch(setSliceNav(true))
                            if (window.innerWidth < 750) {
                               dispatch(setRoomId(""));
                            }
                        }}>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </span>
                        <button className={sliceNav ? "slide-button" : 'hidden'}
                            onClick={() => {
                                dispatch(setSliceNav(false));
                            }}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="chat-title">{nameChat}</span>
                    </div>

                    <div className="chat-messages">
                        {messages.map((data, index) => {
                            return (
                                < div
                                    key={index}
                                    className={`chat-message ${data.sendByUserId === userId ? 'user' : 'other'} ${data.new ? 'new-message' : ''}`} >
                                    <label style={{ color: "black" }}>
                                        {data.message}
                                    </label>
                                    {
                                        data.read && userId === data.sendByUserId && (
                                            <span className={` ${data.sendByUserId === userId ? 'read-status-user' : 'read-status-other'}`} > {moment(data.readTime).format('HH:mm')} อ่านแล้ว</span>
                                        )
                                    }
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} /> {/* Dummy div to scroll to */}
                    </div>
                    <div className="chat-input-container">
                        <input
                            style={{ background: "white" }}
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder=""
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div> : ""}

            </div >
        </>
    );

};

export default ChatUi;
