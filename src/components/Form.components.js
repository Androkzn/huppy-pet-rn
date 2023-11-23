/** @jsxImportSource @emotion/react */

import * as colors from './styles/Colors'
import { useState } from 'react';
import styled from '@emotion/styled/macro'
import Switch from '@mui/material/Switch';
import { ButtonText, ButtonWithImage } from "./Buttons.components"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import CustomDatePicker from "../components/CustomDatePicker.component";
import { Delete } from "@mui/icons-material";

const TitleAndDatePicker = ({ id, title, selectedDate, onChange }) => {
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

  const pickerStyle = {
    
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <CustomDatePicker
        id={id}
        value={selectedDate}
        onChange={onChange}
        dateFormat="yyyy-MM-dd" // Customize the date format if needed
        style= {pickerStyle}
      />
    </div>
  );
};


const DescriptionTextBox = ({  id, name, initialValue, title, onChange, borderColor }) => {
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
          id={id}
          value={initialValue}
          rows="4"
          style={textBoxStyle}
          placeholder="Enter description"
          name={name}  
          onChange={onChange}  
        />
      </div>
    );
  };

  const TitleAndDropdown = ({ id, title, name, initialValue, dropdownOptions, onChange }) => {
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
        style={dropdownStyle}
        value={initialValue}
        onChange={(e) => onChange(e.target.value)} // Only pass the raw enum value to the onChange handler
      >
        {/* Key stores raw value of Enum */}
        {dropdownOptions.map((item) => (
          <option key={item.rawValue} value={item.rawValue}>
            {item.title}
          </option>
        ))}
      </select>
    </div>
    );
  };

  const TitleTooltipAndValue = ({ title, value, tipText}) => {
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      borderRadius: '10px',
      paddingRight: '5px',
      paddingLeft: '5px', 
  };
  
  const titleStyle = {
    marginRight: '10px',
  };
  
  const textStyle = {
    marginRight: '10px',
  };

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 400,
      fontSize: '15px',

    },
  });

    return (
      <div style={containerStyle}>
        <div style={containerStyle}>
          <h3 style={titleStyle}> {title} </h3>
            <CustomWidthTooltip title={tipText}>
              <Button sx={{ m: 1 }}>
                <ButtonText
                  variant="circleTextButtonSmall"
                  height= '25px'
                  width= '25px'
                >
                  ?
                </ButtonText>
              </Button>
            </CustomWidthTooltip>
          </div>
          <h3 style={textStyle}>{value}</h3>
      </div>
    );
  };

  const TitleButtonsAndTextField = ({ id, title, initialValue, name, onChange, onChangeButton }) => {
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
          <ButtonText
            as="button"
            name={name}
            variant="circleTextButton"
            onClick={() => decrementCount()}
          >
            -
          </ButtonText>
          <input
            id={id}
            style={textFieldStyle}
            type="number"
            value={initialValue}
            onChange={(e) => {
              setCount(parseInt(e.target.value, 10) || 0);
              onChange(e);
              e.preventDefault();  
            }}
            onSubmit={(e) => {
              e.preventDefault();  
            }}

            name={name} 
          />
          <ButtonText
            as="button"
            name={name}
            variant="circleTextButton"
            onClick={() => incrementCount()}
          >
            +
          </ButtonText>
        </div>
      </div>
    );
  };

  const TitleAndTextInput = ({ id, initialValue, name, title, onChange, placeholder, borderColor }) => {
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
      fontSize: '18px'
    };
  
    return (
      <div style={containerStyle}>
         <h3 style={titleStyle}>{title}</h3>
        <input
          id={id}
          value={initialValue}
          type="text"
          placeholder= {placeholder}  
          style={textFieldStyle}
          name={name}  
          onChange={onChange}  
        />
      </div>
    );
  };

  const TitleAndToggle = ({ id, name, title, onChange, initialValue }) => {
    const [checked, setChecked] =  useState(initialValue);

    const handleChange = (event) => {
      setChecked(event.target.checked);
      onChange()
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
  
    return (
      <div style={containerStyle}>
         <h3 style={titleStyle}>{title}</h3>
         <Switch
          id={id}  
          name={name}  
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
          color='warning'
          style={{ color: colors.green}}
        />
      </div>
    );
  };

  const TitleToggleAndButtons = ({ id, name, title, onChangeToggle, toggleValue, dailyRatioValue, onChangeDailyRatioValue, maxCountValue = 3000 }) => {
    const [checked, setChecked] = useState(toggleValue);
    const [count, setCount] = useState(dailyRatioValue);
  
    const decrementCount = () => {
      if (count > 0) {
        setCount(count - 1);
        onChangeDailyRatioValue(count - 1);
      }
    };
  
    const incrementCount = () => {
      if (count < maxCountValue) {
        setCount(count + 1);
        onChangeDailyRatioValue(count + 1);
      }
    };
  
    const handleChange = (event) => {
      setChecked(event.target.checked);
      onChangeToggle(event.target.checked);
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
  
    const controlGroup = {
      display: 'flex',
      alignItems: 'center',
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
        <Switch
          id={id}
          name={name}
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
          color='warning'
          style={{ color: colors.green }}
        />
        {checked && (
          <div style={controlGroup}>
            <ButtonText
              as="button"
              name={name}
              variant="circleTextButton"
              onClick={decrementCount}
              disabled={count === 0}
            >
              -
            </ButtonText>
            <input
              id={id}
              style={textFieldStyle}
              type="number"
              value={count}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10) || 0;
                setCount(newValue <= maxCountValue ? newValue : maxCountValue);
                onChangeDailyRatioValue(newValue <= maxCountValue ? newValue : maxCountValue);
                e.preventDefault();
              }}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              name={name}
            />
            <ButtonText
              as="button"
              name={name}
              variant="circleTextButton"
              onClick={incrementCount}
              disabled={count === maxCountValue}
            >
              +
            </ButtonText>
          </div>
        )}
      </div>
    );
  };
  

  const SelectedFoodCategoryRow = ({ id, name, onChange, onDelete, value, color, weight, onChangeButton, remainingPercentage }) => {
    const [count, setCount] = useState(value);
  
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
      margin: '0px',
      padding:  '0px',
    };
  
    const nameStyle = {
      width: '100px',
      borderRadius: '5px',
      padding: '5px',
      backgroundColor: `${color}`, 
    };

    const weightStyle = {
       
    };
  
    const controlGroup = {
      display: 'flex',
      alignItems: 'center',
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
      backgroundColor: `${colors.oliveLight}`, 
    };

    const deleteButonStyle = {
      color: colors.green,
      marginLeft: '20px',
    };
    
    return (
      <div style={containerStyle}>
        <h3 style={nameStyle} >{name}</h3>  
        <h3 style={weightStyle} >{weight}g</h3> 
        <div style={controlGroup}>
          <ButtonText
            as="button"
            name={name}
            variant="circleTextButton"
            onClick={() => decrementCount()}
            disabled={count === 0}
          >
            -
          </ButtonText>
          <input
            id={id}
            style={textFieldStyle}
            type="number" 
            value={count}
            onChange={(e) => {
              const newValue = e.target.value
              // Prevents more than 100% in total for all categories
              if ((newValue > count && remainingPercentage >= (newValue-count)) || (newValue < count)) {
                setCount(parseInt(newValue, 10) || 0);
                onChange(e);
              }
              e.preventDefault();
            }}
            onSubmit={(e) => {
              e.preventDefault();  
            }}

            name={name} 
          />
          <ButtonText
            as="button"
            name={name}
            variant="circleTextButton"
            onClick={() => incrementCount()}
            disabled={remainingPercentage <= 0 }
          >
            +
          </ButtonText>
          <div css={deleteButonStyle}><Delete onClick={() => onDelete()} /></div>
          </div>
      </div>
    );
  };

  const UnselectedFoodCategoryRow = ({name, onAdd, color }) => {
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      borderRadius: '10px',
      margin: '3px',
      paddingRight: '5px',
      paddingLeft: '5px', 
    };
    
    const nameStyle = {
      width: '100px',
      borderRadius: '5px',
      padding: '5px',
      backgroundColor: `${color}`, 
    };

    return (
      <div style={containerStyle}>
          <div style={nameStyle}  onClick={() => onAdd()}>
            {name}
          </div>
            {/* <ButtonWithImage
              variant="addButton"
              width='100px'
              as='button'
              imageName="plus_round_fill_white_button.svg"
              imageSize={20}
              onClick={() => onAdd()}
            >
              Add
            </ButtonWithImage> */}
      </div>
    );
  };

  const LoginTextInput = ({ id, name, onChange, placeholder, borderColor }) => {
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      textAlign: 'center',
      borderRadius: '10px',
      background: colors.white,
      padding: '8px 12px',
      paddingRight: '15px',
      paddingLeft: '15px', 
      minWidth: '250px',
      maxWidth: '300px',
      border: `2px solid  ${borderColor || 'none'}`,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'  
    };
  

    const textFieldStyle = {
      border: 'none', 
      flex: 1,  
      outline: 'none',  
      alignItems: 'center',
      textAlign: 'left',
      marginLeft: '10px',
      borderRadius: '10px',
      height: '20px',
    };

    return (
      <div style={containerStyle}>
        <input
          id={id}  
          type="text"
          placeholder= {placeholder}  
          style={textFieldStyle}
          name={name}  
          onChange={onChange}  
        />
      </div>
    );
  };

  const FormGroup = styled.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  })
  
  
  export  {
    TitleAndDatePicker,
    DescriptionTextBox, 
    TitleAndDropdown, 
    TitleAndTextInput, 
    TitleButtonsAndTextField,
    LoginTextInput,
    FormGroup,
    TitleAndToggle,
    TitleTooltipAndValue,
    TitleToggleAndButtons,
    SelectedFoodCategoryRow,
    UnselectedFoodCategoryRow,
  };
  