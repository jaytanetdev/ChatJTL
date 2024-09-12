// ChatController.js

import { useNavigate } from 'react-router-dom';  // Import useNavigate มา
import { useSelector, useDispatch } from 'react-redux';
import { setUsername, setPassword, selectUsername, selectPassword } from '../../../redux/store/features/login/loginSlice';
import { callApi } from '../../../service/api';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
export const useController = () => {

    const Navigate = useNavigate();  // สร้าง navigate function
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const dispatch = useDispatch();
    const checkLogin = async () => {

        if (username && password) {
            callApi("GET", `/api/get/user?username=${username}&password=${password}`, {})
                .then((res) => {
                    if (res.data === false) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = Swal.stopTimer;
                                toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "error",
                            title: "The username or password is incorrect."
                        });
                    } else {
                        Cookies.set('_id', res.data._id, { expires: 1 });
                        Cookies.set('name', res.data.name, { expires: 1 });
                        Cookies.set('lastname', res.data.lastname, { expires: 1 });
                        Cookies.set('urlPic', res.data.urlPic, { expires: 1 });
                        Navigate('/chat');
                    }
                }).catch((err) => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "error",
                        title: err
                    });
                })



        }
    };

    return { checkLogin }; // Return inputMessage along with other functions
};
