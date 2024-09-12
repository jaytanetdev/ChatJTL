import React, { useState } from 'react';
import { Form, Button, Upload, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./RegisterCss.css";
import InputData from '../../../components/InputData/InputData';
import InputPassword from '../../../components/InputData/InputPassword';
import { useSelector, useDispatch } from 'react-redux';
import {
  setUsername, setPassword, setNmae, setLastname, setImageMeta,
  selectUsername, selectPassword, selectName, selectLastname
} from '../../../redux/store/features/register/registerSlice';
import { useController } from '../controller/RegisterController';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../../../config/firebase'; // นำเข้าการตั้งค่า Firebase

const generateRandomString = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const RegisterUI = () => {
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const password = useSelector(selectPassword);
  const nameUser = useSelector(selectName);
  const lastnameUser = useSelector(selectLastname);

  const [form] = Form.useForm();
  const { saveData } = useController();

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false); // State for tracking upload status
  const [imageRefs, setImageRefs] = useState({}); // To store Firebase references for images

  const uploadImage = async (file) => {
    try {
      const storage = getStorage(app);
      // Generate a unique file name
      const uniqueFileName = `${Date.now()}-${generateRandomString(8)}-${file.name}`;
      const storageRef = ref(storage, `ImgPerson/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, ref: storageRef };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // รีเทิร์นข้อผิดพลาดเพื่อให้ handleUpload รับรู้
    }
  };

  const deleteImage = async (fileRef) => {
    try {
      await deleteObject(fileRef);
      message.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image');
    }
  };

  const handleUpload = async ({ file, onSuccess }) => {
    try {
      setUploading(true); // Set uploading status to true
      const { url, ref } = await uploadImage(file); // ใช้ฟังก์ชัน uploadImage
      dispatch(setImageMeta({ name: file.name, url })); // อัปเดต Redux store
      setFileList([{ uid: file.uid, name: file.name, status: 'done', url }]); // อัปเดต fileList
      setImageRefs(prev => ({ ...prev, [file.uid]: ref })); // Store image reference
      onSuccess(null, file); // เรียก onSuccess หลังจากอัปโหลดเสร็จ
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); // Set uploading status to false after operation
    }
  };

  const handleRemove = async (file) => {
    const { uid } = file;
    const fileRef = imageRefs[uid];
    if (fileRef) {
      await deleteImage(fileRef); // Delete image from Firebase
      setImageRefs(prev => {
        const { [uid]: removed, ...rest } = prev; // Remove image reference from state
        return rest;
      });
    }
    setFileList(prev => prev.filter(item => item.uid !== uid)); // Remove image from fileList
  };

  const onFinish = async () => {
    try {
      await saveData(); // เรียกใช้ฟังก์ชัน saveData จาก controller
      // form.resetFields();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="register-container">
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="register-form"
      >
        <Form.Item className='label-Register'>
          <h2>Register</h2>
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          className="register-form-item"
          rules={[{ required: true, message: 'กรุณากรอก Username' }]}
        >
          <InputData
            name="username"
            value={username}
            onChange={(e) => dispatch(setUsername(e.target.value))}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          className="register-form-item"
          rules={[{ required: true, message: 'กรุณากรอก Password' }]}
        >
          <InputPassword
            name="password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          label="NameUser"
          name="Name"
          className="register-form-item"
          rules={[{ required: true, message: 'กรุณากรอก Name' }]}
        >
          <InputData
            name="Name"
            value={nameUser}
            onChange={(e) => dispatch(setNmae(e.target.value))}
            placeholder="Name"
          />
        </Form.Item>
        <Form.Item
          label="Lastname"
          name="lastname"
          className="register-form-item"
          rules={[{ required: true, message: 'กรุณากรอก Lastname' }]}
        >
          <InputData
            name="lastname"
            value={lastnameUser}
            onChange={(e) => dispatch(setLastname(e.target.value))}
            placeholder="Lastname"
          />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          className="register-form-item"
          rules={[{ required: true, message: 'กรุณาอัปโหลดรูปภาพ' }]}
        >
          <div style={{ position: 'relative' }}>
            <Upload
              name="image"
              listType="picture"
              customRequest={handleUpload} // ใช้ฟังก์ชัน handleUpload
              maxCount={1}
              fileList={fileList} // แสดงรายการไฟล์ที่อัปโหลดแล้ว
              onRemove={handleRemove} // Handle file removal
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {uploading && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin />
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item className="register-form-button">
          <Button
            type="primary"
            htmlType="submit"
            className="register-button"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterUI;
