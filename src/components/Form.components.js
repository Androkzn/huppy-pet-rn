/** @jsxImportSource @emotion/react */

import * as colors from './styles/Colors'
import { useState } from 'react';

const DescriptionTextBox = ({  name, title, onChange, borderColor }) => {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: `2px solid ${borderColor || "none"}`,  
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

  const TitleAndDropdown = ({ title, name, value, dropdownOptions, onChange }) => {
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
      backgroundColor: colors.oliveLight,
  };
    
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <select 
          name={name}  
          value={value}  
          style={dropdownStyle}
          onChange={onChange}  
        >
          {dropdownOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const TitleButtonsAndTextField = ({ title, initialValue, name, onChange, onChangeButton }) => {
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

  const TitleAndTextInput = ({ name, title, onChange, placeholder, borderColor }) => {
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
      border: `2px solid  ${borderColor || "none"}`,  
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
  
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <input
          type="text"
          placeholder= {placeholder}  
          style={textFieldStyle}
          name={name}  
          onChange={onChange}  
        />
      </div>
    );
  };
  
  export  {
    DescriptionTextBox, 
    TitleAndDropdown, 
    TitleAndTextInput, 
    TitleButtonsAndTextField,
  };
  