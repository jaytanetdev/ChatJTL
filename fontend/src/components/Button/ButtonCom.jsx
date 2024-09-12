import React from 'react';
import { Button } from 'antd';


function ButtonCom({ children,
    onClick,
    style,
    className,
    disabled = false }) {

    return (
        <>
            <Button 
                onClick={onClick}
                className={className}
                style={style}
                disabled={disabled}>
                {children}
            </Button>
        </>
    )
}

export default ButtonCom

