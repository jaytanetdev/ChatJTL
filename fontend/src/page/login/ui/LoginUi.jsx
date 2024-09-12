import React from 'react';
import { Form, Button } from 'antd';
import "./Logincss.css";
import InputData from '../../../components/InputData/InputData';
import InputPassword from '../../../components/InputData/InputPassword';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername, setPassword, selectUsername, selectPassword } from '../../../redux/store/features/login/loginSlice';
import { useController } from '../controller/LoginController';
import { Link } from 'react-router-dom';

const LoginUi = () => {
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const password = useSelector(selectPassword);
  const { checkLogin } = useController();
  const [form] = Form.useForm(); // สร้าง instance ของ Form

  const onFinish = () => {
    checkLogin();
    // form.resetFields(); // รีเซ็ตค่าฟอร์ม
  };

  return (
    <div className="login-container">
      <Form
        form={form} // เชื่อม instance ของ Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="login-form"
      >
        <img className="login-imglogo" src="/img/logo.png" alt="main_logo" />
        <Form.Item
          label="Username"
          name="username"
          className="login-form-username input-wrapper"
          rules={[{ required: true, message: 'กรุณากรอก Username' }]}
        >
          <InputData
            name="username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            placeholder="username"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          className="login-form-password input-wrapper"
          rules={[{ required: true, message: 'กรุณากรอก Password' }]}
        >
          <InputPassword
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            placeholder="password"
          />
        </Form.Item>
        <Form.Item className="login-form-button">
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
          >
            Login
          </Button>
      
        </Form.Item>
        <Form.Item className="link-register">
            <Link to="/register">Register Account</Link>

          </Form.Item>
      </Form>
    </div>
  );
};

export default LoginUi;
