import React from 'react';
import { Avatar, Badge, Space } from 'antd';

function AvatarPic({ sizeImg, className, src, countNoRead, setStyle, onClick }) {
  return (
    < Space size={sizeImg} >
      <Badge count={countNoRead}   >
        <Avatar shape="square" size={sizeImg} className={className}  style={setStyle} src={src} onClick={onClick} />
      </Badge>
    </Space >
  )
}
export default AvatarPic;


