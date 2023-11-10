/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import * as colors from './styles/colors'
import React, { useState } from 'react';

const AddFoodTitleButtonsAndTextField = ({ title, initialValue, name, onChange, onChangeButton }) => {
  const [count, setCount] = useState(initialValue);

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
      onChangeButton(name, count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
    onChangeButton(name, count + 1);
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={controlGroup}>
      <button style={buttonStyle} type="button" onClick={() => decrementCount()} name={name}>
          -
        </button>
        <input
          style={textFieldStyle}
          type="number"
          value={count}
          onChange={(e) => {
            setCount(parseInt(e.target.value, 10) || 0);
            onChange(e);  
          }}
          name={name} 
        />
        <button style={buttonStyle} type="button" onClick={incrementCount}  name={name} >
          +
        </button>
      </div>
    </div>
  );
};


const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  textAlign: 'center',
  borderRadius: '10px',
  paddingRight: '15px',
  paddingLeft: '15px',
  background: `${colors.lightBrown}`,
  margin: '3px',  
};

const titleStyle = {
  marginRight: '0px',

};

const controlGroup = {
  display: 'flex',
  alignItems: 'center',
  //width: '150px', // Fixed width for the control group
};

const buttonStyle = {
  background: `${colors.lightGreen}`,
  width: "35px",
  height: "35px",
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: '20px', 
  borderRadius: '20px',
  border: `none`,

  ':hover': {
    background: `${colors.orange}`, 
  },

  color: 'white',
};

const textFieldStyle = {
  border: 'none',
  outline: 'none',
  width: '50px',
  textAlign: 'center',
  marginRight: '15px',
  marginLeft: '15px',
  borderRadius: '10px',
  height: '30px',
};

export default AddFoodTitleButtonsAndTextField;
