
import React from 'react'
import { Input } from 'antd';
import './InputDatacss.css'
function InputData({ name, value, onChange, placeholder }) {
    return (
        <><Input
            className='input'
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder} /></>
    )
}

export default InputData