
import React from 'react'
import { Input } from 'antd';
import './InputDatacss.css'
function InputPassword({ name, value, onChange, placeholder}) {
    return (
        <><Input.Password
            className='input'
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder} />
        </>
    )
}

export default InputPassword