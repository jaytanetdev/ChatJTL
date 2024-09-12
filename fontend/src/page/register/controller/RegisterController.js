// ChatController.js

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    setUsername, setPassword, setNmae, setLastname, setImageMeta,
    selectUsername, selectPassword, selectName, selectLastname, selectImageMeta
} from '../../../redux/store/features/register/registerSlice';
import { callApi } from '../../../service/api';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
export const useController = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const nameUser = useSelector(selectName);
    const lastnameUser = useSelector(selectLastname);
    const imageMeta = useSelector(selectImageMeta);

    const saveData = async () => {
        try {
            const imageUrl = imageMeta?.url; // ใช้ URL ที่เก็บใน Redux store
            if (username && password) {
                const res = await callApi("GET", `/api/get/user/checkregister?username=${username}`, {});
                if (res.data === true) {
                    const resIns = await callApi("POST", `/api/ins/user`, {
                        username,
                        password,
                        name: nameUser,
                        lastname: lastnameUser,
                        urlPic: imageUrl || ''
                    });
                    if (resIns) {
                        Swal.fire({
                            icon: 'success',
                            title: 'บันทึกข้อมูลสำเร็จ',
                            toast: true,
                            position: 'top-end',
                            timer: 3000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });

                      const resUser=  await callApi("GET", `/api/get/user?username=${username}&password=${password}`, {})
                        Cookies.set('_id', resUser.data._id, { expires: 1 });
                        Cookies.set('name', resUser.data.name, { expires: 1 });
                        Cookies.set('lastname', resUser.data.lastname, { expires: 1 });
                        Cookies.set('urlPic', resUser.data.urlPic, { expires: 1 });

                        dispatch(setUsername(""))
                        dispatch(setPassword(""))
                        dispatch(setNmae(""))
                        dispatch(setLastname(""))
                        dispatch(setImageMeta({}))
                        navigate("/chat")
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Username มีอยู่แล้วกรุณาใช้ชื่ออื่น',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: error.message || 'เกิดข้อผิดพลาด',
                toast: true,
                position: 'top-end',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    };



    return { saveData };
};
