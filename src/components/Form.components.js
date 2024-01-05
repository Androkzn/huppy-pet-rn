/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled';
import { styled as styledMaterial } from '@mui/material/styles';
import * as colors from './styles/Colors';
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import { ButtonText, ButtonImage } from './Buttons.components';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import CustomDatePicker from '../components/CustomDatePicker.component';
import { Delete } from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from '../helpers/Constants.helper';
import * as enums from '../helpers/Enums.helper';

const TitleAndDatePicker = ({ id, title, selectedDate, onChange }) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: Constants.mainBorderRadius,
    margin: Constants.mainFormDevider,
    background: `${colors.lightBrown}`,
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
  };

  const titleStyle = {
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const pickerStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <CustomDatePicker
        id={id}
        value={selectedDate}
        onChange={onChange}
        dateFormat="yyyy-MM-dd" // Customize the date format if needed
        style={pickerStyle}
      />
    </div>
  );
};

const TitleAndSlider = ({
  title,
  firstValueTitle,
  secondValueTitle,
  firstValue,
  secondValue,
  onChange,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

  // Calculate the initial percentage based on the provided values
  const initialPercentage =
    secondValue === 0 ? 0 : 100 - firstValue + secondValue;

  const [value, setValue] = useState(initialPercentage);

  const sliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSliderChangeEnd = () => {
    onChange(getFirstNewValue(), getSecondNewValue());
  };

  const getFirstNewValue = () => {
    const updatedValue = Math.floor(100 - value);
    return updatedValue;
  };

  const getSecondNewValue = () => {
    return 100 - getFirstNewValue();
  };

  const SliderCustom = styledMaterial(Slider)({});

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: Constants.mainBorderRadius,
    margin: Constants.mainFormDevider,
    background: `${colors.lightBrown}`,
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
  };

  const titleStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontWeight: 'bold',
    margin: '5px 0px',
  };
  const valueTitleStyle = {
    fontSize: '14px',
    color: `${colors.black}`,
  };

  const sliderStyle = {
    margin: '0px 15px',
    width: '100%',
  };

  const sliderComponentStyle = {
    color: `${colors.green}`,
  };

  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  };

  const valueContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100px',
  };

  return (
    <div style={containerStyle}>
      {/* Title */}
      <div style={titleStyle}>{title}</div>
      {/* Slider Container */}
      <div style={sliderContainerStyle}>
        <div style={valueContainerStyle}>
          <div style={valueTitleStyle}>{firstValueTitle}</div>
          <div style={valueTitleStyle}>{getFirstNewValue()}</div>
        </div>
        <div style={sliderStyle}>
          <Slider
            style={sliderComponentStyle}
            onChange={(e, newValue) => sliderChange(e, newValue)}
            onChangeCommitted={() => handleSliderChangeEnd()}
            value={value}
          />
        </div>
        <div style={valueContainerStyle}>
          <div style={valueTitleStyle}>{secondValueTitle}</div>
          <div style={valueTitleStyle}>{getSecondNewValue()}</div>
        </div>
      </div>
    </div>
  );
};

export default TitleAndSlider;

const DescriptionTextBox = ({
  id,
  name,
  initialValue,
  title,
  onChange,
  borderColor,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `2px solid ${borderColor || 'none'}`,
    borderRadius: '10px',
    background: `${colors.lightBrown}`,
    marginTop: Constants.mainMargin,
    marginRight: Constants.mainFormDevider,
    marginLeft: Constants.mainFormDevider,
    marginBottom: Constants.mainMargin,
  };

  const titleStyle = {
    margin: '10px 0 0 0',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const textBoxStyle = {
    outline: 'none',
    width: '85%',
    margin: '10px 0px',
    padding: '10px 10px',
    borderRadius: '10px',
    border: `1px solid ${colors.gray}`,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
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

const TitleAndDropdown = ({
  id,
  title,
  name,
  initialValue,
  dropdownOptions,
  onChange,
  disabled,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: '10px',
    margin: Constants.mainFormDevider,
    background: `${colors.lightBrown}`,
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
  };

  const titleStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontWeight: 'bold',
    margin: ' 15px 10px 15px 0px',
  };

  const titleDisabledStyle = {
    marginRight: '30%',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const dropdownStyle = {
    width: '210px',
    borderRadius: '10px',
    height: '35px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    backgroundColor: colors.oliveLight,
    color: colors.green,
    fontFamily: "'Balsamiq Sans', sans-serif",
    fontSize: '15px',
    maxWidth: '150px',
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      {disabled ? (
        <div style={titleDisabledStyle}>
          {enums.getTitleUpercased(initialValue)}
        </div>
      ) : (
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
      )}
    </div>
  );
};

const TitleTooltipAndValue = ({ title, value, tipText }) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: '10px',
    paddingRight: Constants.smallPadding,
    paddingLeft: Constants.mainPadding,
  };

  const titleStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const textStyle = {
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: isSmallScreen ? 250 : 400,
      fontSize: isSmallScreen
        ? Constants.smallFontSize
        : Constants.mainFontSize,
    },
  });

  const rowStyle = {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    flexDirection: 'row',
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <h3 style={titleStyle}> {title} </h3>
        <CustomWidthTooltip title={tipText}>
          <Button sx={{ m: 1, margin: '0px', margin: '0px' }}>
            <ButtonText
              variant="circleTextButtonSmall"
              height="25px"
              width="25px"
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

const TitleButtonsAndTextField = ({
  id,
  title,
  initialValue,
  name,
  onChange,
  onChangeButton,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const [count, setCount] = useState(initialValue || 0);
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

  const onChangeTextField = (e) => {
    const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setCount(newValue);
    onChange(newValue);
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: '10px',
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    background: `${colors.lightBrown}`,
    margin: Constants.mainFormDevider,
  };

  const titleStyle = {
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
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
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    marginLeft: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    borderRadius: '10px',
    height: '30px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
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
          value={count.toString()}
          onChange={(e) => {
            onChangeTextField(e);
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

const TitleAndTextInput = ({
  id,
  initialValue,
  name,
  title,
  onChange,
  placeholder,
  borderColor,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: '10px',
    margin: Constants.mainFormDevider,
    background: `${colors.lightBrown}`,
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    border: `2px solid  ${borderColor || 'none'}`,
  };

  const titleStyle = {
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const textFieldStyle = {
    minWidth: '100px',
    border: 'none',
    flex: 1,
    outline: 'none',
    alignItems: 'center',
    textAlign: 'center',
    marginLeft: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    borderRadius: Constants.mainBorderRadius,
    height: '30px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <input
        id={id}
        value={initialValue}
        type="text"
        placeholder={placeholder}
        style={textFieldStyle}
        name={name}
        onChange={onChange}
      />
    </div>
  );
};

const ButtonsAndTextField = ({
  id,
  initialValue,
  name,
  onChange,
  onChangeButton,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const [count, setCount] = useState(initialValue || 0);
  const decrementCount = () => {
    if (count > 0) {
      const newCount = Math.max(count - 10, 1);
      setCount(newCount);
      onChangeButton(name, newCount);
    }
  };

  const incrementCount = () => {
    setCount(count + 10);
    onChangeButton(name, count + 10);
  };

  const onChangeTextField = (e) => {
    const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    setCount(newValue);
    onChange(newValue);
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    margin: Constants.mainFormDevider,
  };

  const controlGroup = {
    display: 'flex',
    alignItems: 'center',
  };

  const textFieldStyle = {
    border: `2px solid  ${colors.gray}`,
    outline: 'none',
    width: '50px',
    textAlign: 'center',
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    marginLeft: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    borderRadius: '10px',
    height: '30px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  return (
    <div style={containerStyle}>
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
          value={count.toString()}
          onChange={(e) => {
            onChangeTextField(e);
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

const TitleAndToggle = ({
  id,
  name,
  title,
  onChange,
  initialValue,
  containerStyle,
  titleStyle,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const [checked, setChecked] = useState(initialValue);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onChange();
  };

  const padding = isSmallScreen
    ? Constants.smallPadding
    : Constants.mainPadding;

  const containerDefaultStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: Constants.mainBorderRadius,
    background: `${colors.lightBrown}`,
    padding: `${padding} ${Constants.mainPadding} ${padding} ${Constants.mainPadding}`,
    margin: Constants.mainFormDevider,
  };

  const mergedContainerStyles = { ...containerDefaultStyle, ...containerStyle };

  const titleDefaultStyle = {
    margin: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const mergedTitleStyles = { ...titleDefaultStyle, ...titleStyle };

  return (
    <div style={mergedContainerStyles}>
      <h3 style={mergedTitleStyles}>{title}</h3>
      <Switch
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
        color="warning"
        style={{ color: colors.green }}
      />
    </div>
  );
};

const TitleToggleAndButtons = ({
  id,
  name,
  title,
  onChangeToggle,
  toggleValue,
  dailyRatioValue,
  onChangeDailyRatioValue,
  maxCountValue = 3000,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
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

  const handleToggleChange = (event) => {
    setChecked(event.target.checked);
    onChangeToggle(event.target.checked);
  };

  const handleTextFieldChange = (event) => {
    const newValue =
      event.target.value === '' ? 0 : parseInt(event.target.value, 10);
    setCount(newValue <= maxCountValue ? newValue : maxCountValue);
    onChangeDailyRatioValue(
      newValue <= maxCountValue ? newValue : maxCountValue
    );
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'left',
    borderRadius: Constants.mainBorderRadius,
    background: `${colors.lightBrown}`,
    paddingRight: isSmallScreen
      ? Constants.smallPadding
      : Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    margin: Constants.mainFormDevider,
  };

  const titleStyle = {
    marginRight: Constants.mainMargin,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const controlGroup = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: isSmallScreen ? Constants.smallMargin : '0px',
  };

  const textFieldStyle = {
    border: 'none',
    outline: 'none',
    width: '50px',
    textAlign: 'center',
    marginRight: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    marginLeft: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
    borderRadius: Constants.mainBorderRadius,
    height: '30px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  return (
    <div style={containerStyle}>
      <div style={controlGroup}>
        <h3 style={titleStyle}>{title}</h3>
        <Switch
          id={id}
          name={name}
          checked={checked}
          onChange={handleToggleChange}
          inputProps={{ 'aria-label': 'controlled' }}
          color="warning"
          style={{ color: colors.green }}
        />
      </div>
      <div style={controlGroup}>
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
              value={count.toString()}
              onChange={(e) => {
                handleTextFieldChange(e);
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
    </div>
  );
};

const SelectedFoodCategoryRow = ({ name, value, color, weight }) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    borderRadius: Constants.mainBorderRadius,
    height: isSmallScreen ? '35px' : '45px',
  };

  const nameStyle = {
    width: '100px',
    borderRadius: Constants.smallBorderRadius,
    padding: Constants.smallPadding,
    backgroundColor: `${color}`,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const weightStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const valueStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  return (
    <div style={containerStyle}>
      <h3 style={nameStyle}>{name}</h3>
      <h3 style={weightStyle}>{weight} g</h3>
      <h3 style={valueStyle}>{value}%</h3>
    </div>
  );
};

const SelectedCustomFoodCategoryRow = ({
  id,
  name,
  onChange,
  onDelete,
  value,
  color,
  weight,
  onChangeButton,
  remainingPercentage,
}) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

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
    borderRadius: Constants.mainBorderRadius,
    height: '45px',
  };

  const nameStyle = {
    width: isSmallScreen ? '60px' : '100px',
    borderRadius: isSmallScreen
      ? Constants.smallBorderRadius
      : Constants.mainBorderRadius,
    padding: isSmallScreen ? Constants.smallPadding : Constants.smallPadding,
    backgroundColor: `${color}`,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const weightStyle = {
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  const controlGroup = {
    display: 'flex',
    alignItems: 'center',
  };

  const textFieldStyle = {
    border: 'none',
    outline: 'none',
    width: isSmallScreen ? '30px' : '50px',
    textAlign: 'center',
    marginRight: Constants.smallMargin,
    marginLeft: Constants.smallMargin,
    borderRadius: Constants.mainBorderRadius,
    height: '30px',
    backgroundColor: `${colors.oliveLight}`,
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  const deleteButonStyle = {
    color: colors.green,
    marginLeft: isSmallScreen ? Constants.smallMargin : Constants.mainMargin,
  };

  return (
    <div style={containerStyle}>
      <h3 style={nameStyle}>{name}</h3>
      <h3 style={weightStyle}>{weight}g</h3>
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
          value={count.toString()}
          onChange={(e) => {
            const newValue =
              e.target.value === '' ? 0 : parseInt(e.target.value, 10);
            // Prevents more than 100% in total for all categories
            if (
              (newValue > count && remainingPercentage >= newValue - count) ||
              newValue < count
            ) {
              setCount(newValue);
              onChange(newValue);
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
          disabled={remainingPercentage <= 0}
        >
          +
        </ButtonText>
        <div css={deleteButonStyle}>
          <Delete onClick={() => onDelete()} />
        </div>
      </div>
    </div>
  );
};

const UnselectedFoodCategoryRow = ({ name, onAdd, color }) => {
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    borderRadius: Constants.mainBorderRadius,
    margin: Constants.mainFormDevider,
    paddingRight: Constants.smallPadding,
    paddingLeft: Constants.smallPadding,
  };

  const nameStyle = {
    width: '100px',
    borderRadius: Constants.smallBorderRadius,
    padding: Constants.smallPadding,
    backgroundColor: `${color}`,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
  };

  return (
    <div style={containerStyle}>
      <div style={nameStyle} onClick={() => onAdd()}>
        {name}
      </div>
      {/* <ButtonImage
              variant="addButton"
              width='100px'
              as='button'
              imageName="plus_round_fill_white_button.svg"
              imageSize={20}
              onClick={() => onAdd()}
            >
              Add
            </ButtonImage> */}
    </div>
  );
};

const LoginTextInput = ({ id, name, initialValue, onChange, placeholder, borderColor, isPassword = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    borderRadius: Constants.mainBorderRadius,
    background: colors.white,
    padding: '8px 12px',
    paddingRight: Constants.mainPadding,
    paddingLeft: Constants.mainPadding,
    minWidth: '270px',
    maxWidth: '270px',
    border: `2px solid  ${borderColor || 'none'}`,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  };

  const textFieldStyle = {
    border: 'none',
    flex: 1,
    outline: 'none',
    alignItems: 'center',
    textAlign: 'left',
    marginLeft: Constants.mainMargin,
    borderRadius: Constants.mainBorderRadius,
    height: '30px',
    fontSize: isSmallScreen ? Constants.smallFontSize : Constants.mainFontSize,
    fontFamily: "'Balsamiq Sans', sans-serif",
    color: colors.green
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e); // Propagate the change event to the parent component if needed
  };

  return (
    <div style={containerStyle}>
      <input
        id={id}
        type={showPassword ? 'text' : (isPassword ? 'password' : 'text')}
        placeholder={placeholder}
        style={textFieldStyle}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
      />
      {isPassword && inputValue.trim() !== '' && (
        <ButtonImage
          variant="iconButton"
          imageName={showPassword ? 'show_password.svg' : 'hide_password.svg'}
          imageSize={20}
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export {
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
  SelectedCustomFoodCategoryRow,
  UnselectedFoodCategoryRow,
  TitleAndSlider,
  ButtonsAndTextField,
};
