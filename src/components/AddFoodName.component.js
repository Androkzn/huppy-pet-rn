/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import * as colors from './styles/colors'
import React from 'react';



const TitleAndDropdown = ({ title, name, value, dropdownOptions, onChange }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <select 
        name={name}  
        value={value}  
        style={dropdownStyle}
        onChange={onChange}  
      >
        {dropdownOptions.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
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
};

const titleStyle = {
  marginRight: '10px',
};

const dropdownStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '35px',
    paddingRight: '15px',
    paddingLeft: '15px',
};

export default TitleAndDropdown;
