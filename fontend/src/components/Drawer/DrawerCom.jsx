import React from 'react';
import { Button, Drawer, Space } from 'antd';
const DrawerCom = ({ open, onHide, title, children }) => {

  return (
    <>
      <Drawer
        title={title}
        placement="right"
        width="auto"
        onClose={onHide}
        open={open}
        extra={
          <Space>
            <Button onClick={onHide}>Cancel</Button>
            {/* <Button type="primary" onClick={onHide}>
              OK
            </Button> */}
          </Space>
        }
      >
        {children}
      </Drawer>
    </>
  );
};
export default DrawerCom;