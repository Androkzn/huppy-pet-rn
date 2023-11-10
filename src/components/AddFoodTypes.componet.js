/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import * as colors from './styles/colors'
import React from 'react';

const AddFoodTitleAndTextInput = ({ name, title, onChange }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <input
        type="text"
        placeholder="Enter food name"
        style={textFieldStyle}
        name={name}  
        onChange={onChange}  
      />
    </div>
  );
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    borderRadius: '10px',
    margin: '3px',
    background: `${colors.lightBrown}`, 
    paddingRight: '15px',
    paddingLeft: '15px', 
    border: `2px solid ${colors.green}`,  
};

const titleStyle = {
  marginRight: '10px',
};

const textFieldStyle = {
  border: 'none', 
  flex: 1,  
  outline: 'none',  
  alignItems: 'center',
  textAlign: 'center',
  marginLeft: '15px',
  borderRadius: '10px',
  height: '30px',
};

export default AddFoodTitleAndTextInput;
