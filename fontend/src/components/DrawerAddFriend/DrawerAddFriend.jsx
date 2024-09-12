import React, { useState, useEffect } from 'react'
import DrawerCom from '../Drawer/DrawerCom'
import ButtonCom from '../Button/ButtonCom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import AvatarPic from '../AvatarPic/AvatarPic';
import PopconfirmCom from '../PopConfirmCom/PopConfirmCom';
import { callApi } from '../../service/api';
import { useSelector, useDispatch } from 'react-redux';
import { alert } from '../../utils/alert';
import { setFriend, selectFriend, setCountRF, selectCountRF } from '../../redux/store/features/addFriend/friendSlice';
import { setUserData, setRoomId } from '../../redux/store/features/navbar/navbarSlice';
import Cookies from 'js-cookie';
import './DrawerAddFriendCss.css'

function DrawerAddFriend() {
    const countRF = useSelector(selectCountRF);
    const dataFriend = useSelector(selectFriend);
    const [openModal, setOpenModal] = useState(false);
    const [friendsPerRow, setFriendsPerRow] = useState(5);
    const userId = Cookies.get('_id');
    const dispatch = useDispatch();
    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1125) {
                setFriendsPerRow(5);
            } else if (width >= 911) {
                setFriendsPerRow(4);
            } else if (width >= 688) {
                setFriendsPerRow(3);
            } else if (width >= 465) {
                setFriendsPerRow(2);
            } else {
                setFriendsPerRow(1);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    async function fetchData() {
        const response = await callApi("GET", `/api/get/Friend/${userId}`, {});
        dispatch(setFriend(response.data))

        const responseReceiveFriend = await callApi("GET", `/api/count/waitReceiveFriend/${userId}`, {});
        let countReceive = 0;
        if (responseReceiveFriend.data.length > 0) {
            countReceive = responseReceiveFriend.data[0].count;
        }
        dispatch(setCountRF(countReceive));


    }

    async function handleAddFriend(value, type) {

        if (type === "add") {
            callApi("POST", `/api/ins/room`, {
                userIdSender: userId,
                userIdReceiver: value._id,
                status: "0"
            }).then(() => {
                alert("success", "ส่งคำขอเพิ่มเพื่อนสำเร็จ")
            }).catch(() => {
                alert("error", "ไม่สามารถเพิ่มเพื่อนได้")
            })
        } else if (type === "receiver") {
            callApi("PUT", `/api/update/room/${value.room[0]._id}`, {
                status: "1"
            }).then(async () => {
                const response = await callApi("GET", `/api/get/room/${userId}?status=1 `, {});
                dispatch(setUserData(response.data))
                dispatch(setRoomId(response.data[0]._id))
                alert("success", "คุณได้เป็นเพื่อนกันแล้ว")
            }).catch(() => {
                alert("error", "ไม่สามารถเพิ่มเพื่อนได้")
            })

        }

        fetchData()
    }
    return (
        <>

            <AvatarPic src="/img/user.png" className="avata-btn" countNoRead={countRF} onClick={() => { setOpenModal(true) }} />
            <DrawerCom
                title="เพิ่มเพื่อน"
                open={openModal}
                onHide={() => { setOpenModal(false) }}>
                <div >
                    {dataFriend && dataFriend.length > 0 ? (
                        dataFriend.map((value, index) => {

                            if (index % friendsPerRow === 0) {
                                return (
                                    <div key={index} style={{ display: "flex", marginBottom: "1rem" }}>
                                        {dataFriend.slice(index, index + friendsPerRow).map((value, idx) => (
                                            <div key={idx} style={{ display: "grid", marginRight: "1rem" }}>
                                                <label style={{ display: "flex", justifyContent: "center" }}>{value.name + " " + value.lastname}</label>
                                                <AvatarPic setStyle={{ width: "200px", height: "200px" }} src={value.urlPic} />
                                                {value.room.length > 0 && value.room[0].userIdReceiver === userId && value.room[0].status === "0" ?
                                                    <PopconfirmCom title="คุณต้องการรับเพื่อนใช่หรือไม่ ?" onClick={() => { handleAddFriend(value, "receiver") }}>
                                                        <ButtonCom className="button-receiver-friend" >
                                                            Receiver Friend
                                                        </ButtonCom>
                                                    </PopconfirmCom>
                                                    : <PopconfirmCom title="คุณต้องการที่จะเพิ่มเพื่อนใช่หรือไม่ ?" onClick={() => { handleAddFriend(value, "add") }}>
                                                        <ButtonCom className="button-add"
                                                            disabled={value.room.length > 0 && value.room[0].userIdSender === userId
                                                                || value.room.length > 0 && value.room[0].status === "1" ? "disabled" : ""} >
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </ButtonCom>
                                                    </PopconfirmCom>}
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            return null;
                        })
                    ) : (
                        <p>No friends available</p>
                    )}
                </div>
            </DrawerCom>
        </>
    );
}

export default DrawerAddFriend