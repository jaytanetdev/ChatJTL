import { message } from 'antd';

export const alert = (type, content) => {
    message.open({
        type,
        content,
    });
};
