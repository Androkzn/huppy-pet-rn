/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import * as colors from './styles/colors'
import React from 'react';


const AddFoodTitleDescriptionAndTextBox = ({  name, title, onChange }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <textarea
        rows="4"
        style={textBoxStyle}
        placeholder="Enter description"
        name={name}  
        onChange={onChange}  
      />
    </div>
  );
};

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `2px solid ${colors.green}`,  
    borderRadius: '10px',  
    background: `${colors.lightBrown}`,
    marginTop: '10px', 
    marginRight: '3px',
    marginLeft: '3px',
    marginBottom: '10px',  
  };

const titleStyle = {
  margin: '5px',
};

const textBoxStyle = {
  outline: 'none', 
  width: '95%',
  margin: '15px',
  borderRadius: '10px', 
  border: `1px solid ${colors.gray}`,   
};

export default AddFoodTitleDescriptionAndTextBox;
