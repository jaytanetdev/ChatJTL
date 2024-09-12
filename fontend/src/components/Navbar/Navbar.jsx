import React, { useEffect, useState } from 'react'
import './Navbarcss.css'
import InputData from '../InputData/InputData'
import AvatarPic from '../AvatarPic/AvatarPic'
import { callApi } from '../../service/api'
import { useSelector, useDispatch } from 'react-redux';
import { setNameChat } from '../../redux/store/features/chat/chatSlice';
import { setUserData, selectUserData, setRoomId, selectSliceNav, setSliceNav } from '../../redux/store/features/navbar/navbarSlice';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate มา
import { Spin } from 'antd';  // นำเข้า Spin จาก antd
import io from 'socket.io-client';
import DrawerAddFriend from '../DrawerAddFriend/DrawerAddFriend'

function Navbar() {
    const Navigate = useNavigate();  // สร้าง navigate function
    const userId = Cookies.get('_id');
    const userData = useSelector(selectUserData);
    const sliceNav = useSelector(selectSliceNav);
    const dispatch = useDispatch();
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(false);  // สร้าง state สำหรับ loading
    useEffect(() => {
        fetchData()
        Cookies.remove('clickRoomId');
    }, [])

    const socket = io(import.meta.env.VITE_API);
    useEffect(() => {
        if (!userId) {
            Navigate('/login');
        }
        socket.on('message_chats', async (data) => {
            const clickRoomId = Cookies.get('clickRoomId');
            const userIdCheck = Cookies.get('_id');
            if (data.sendByUserId !== userIdCheck) {
                if (data.roomId === clickRoomId) {
                    await callApi("PUT", `/api/update/ChatMessage/${data.roomId}/${data.sendByUserId}/eq`, { read: true });
                }
            }
            const response = await callApi("GET", `/api/get/room/${userId}?status=1`, {});
            dispatch(setUserData(response.data))

        });
    }, [])


    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const clickRoomId = Cookies.get('clickRoomId');
            if (width < 750) {

                if (clickRoomId) {
                    dispatch(setSliceNav(false));
                }
            } else {
                console.log("else", clickRoomId)
                dispatch(setSliceNav(true));
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);





    async function fetchData(value) {
        var endpoint = `/api/get/room/${userId}?status=1`
        if (value) {
            endpoint += `&search=${value}`;
        }
        const response = await callApi("GET", endpoint, {});
        dispatch(setUserData(response.data))
        if (response.data.lenght > 0) {
            dispatch(setRoomId(response.data[0]._id))
        }
    }
    const handleChatClick = async (id) => {
        try {
            setLoading(true);  // เปิด loading ก่อนการทำงาน
            const [readChat, response] = await Promise.all([
                callApi("PUT", `/api/update/ChatMessage/${id}/${userId}/ne`, { read: true }),
                callApi("GET", `/api/get/UserReceiver/${userId}/${id}`, {})
            ]);
            if (window.innerWidth < 750) {
                dispatch(setSliceNav(false));
            }
            if (readChat.data.modifiedCount > 0) {
                fetchData();
            }
            dispatch(setRoomId(id));
            dispatch(setNameChat(response.data[0].userDetails.name + ' ' + response.data[0].userDetails.lastname));
            setActiveChat(id);
            Cookies.set('clickRoomId', id, { expires: 1 });
        } catch (error) {
            console.error("Error handling chat click:", error);
        } finally {
            setLoading(false);  // ปิด loading หลังจากการทำงานเสร็จสมบูรณ์
        }
    }

    const handleSerchFriend = (value) => {
        fetchData(value)
    }
    const handleLogout = () => {
        Cookies.remove('_id');
        Cookies.remove('name');
        Cookies.remove('lastname');
        Cookies.remove('urlPic');
        Cookies.remove('clickRoomId');
        Navigate('/login')
    }
    return (
        <div className={sliceNav === true ? 'container' : 'container-none'}  >
            {loading && (
                <div className="loading-overlay">
                    <Spin size="large" />
                </div>
            )}
            <div className='div-main'>
                <div className='div-input-search'>
                    <div style={{ display: 'flex' }}>
                        <DrawerAddFriend />
                        <span style={{ marginRight: "13px" }} />
                        < InputData placeholder='ค้นหา ชื่อเพื่อน' onChange={(e) => handleSerchFriend(e.target.value)} />
                    </div>
                </div>
                <div className='div-main-chat'>
                    {userData.map((value, index) => (
                        <div key={index} className={`div-chat ${activeChat === value._id ? 'active' : ''}`}
                            onClick={() => handleChatClick(value._id)}>
                            <AvatarPic sizeImg="large" src={value.userDetails.urlPic} countNoRead={value.messageChatCount ? value.messageChatCount.coutChatNoRead : 0} />
                            <p className='div-detail-chat' >
                                <label className='name'>{value.userDetails.name + " " + value.userDetails.lastname}</label>
                                <label className='text-chat'>{value.lastChat ? value.lastChat.message : ""}</label>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='div-logout'>
                <div className='logout' onClick={() => { handleLogout() }}> <FontAwesomeIcon icon={faSignOutAlt} /> Logout</div>
            </div>
        </div >
    )
}

export default Navbar