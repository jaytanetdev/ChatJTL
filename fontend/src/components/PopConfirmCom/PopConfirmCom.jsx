import React from 'react';
import { Popconfirm } from 'antd';

const PopconfirmCom = ({ title, description, children, onClick }) => (
    <Popconfirm
        title={title}
        description={description}
        onConfirm={onClick}
        okText="Yes"
        cancelText="No"

    >
        {children}
    </Popconfirm>
);
export default PopconfirmCom;