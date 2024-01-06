/** @jsxImportSource @emotion/react */

import * as colors from './Colors';

// Main container
const trainingConteinerStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: colors.lightBrown,
  minWidth: '300px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
};

const columnStyle = {
  display: 'flex',
  justifyContent: 'top',
  flexDirection: 'column',
  width: '100%',
};

const textTitleStyle = {
  padding: '10px 5px 0px 5px',
  margin: '0px',
  textAlign: 'left',
  fontSize: '17px',
  color: colors.green,
  fontWeight: 'bold',
};

const textStyle = {
  padding: '5px',
  margin: '0px',
  textAlign: 'left',
  fontSize: '15px',
};

const iconContainerStyle = {
  minWidth: '20%',
  marginLeft: '5px',
};

const headerTrainingStyle = (isCompleted) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '0px',
  textAlign: 'center',
  width: '100%',
  height: '60px',
  backgroundColor: isCompleted ? colors.lightGreen2 : colors.lightBrown2,
});

const dropdownStyle = {
  width: '150px',
  borderRadius: '10px',
  height: '35px',
  paddingRight: '15px',
  paddingLeft: '15px',
  backgroundColor: colors.oliveLight,
  fontFamily: "'Balsamiq Sans', sans-serif",
};

const checkboxStyle = {
  width: '150px',
  borderRadius: '10px',
  height: '35px',
};

const fixedTopContainer = (isSmallScreen) => ({
  position: 'sticky',
  top: isSmallScreen ? 60 : 60,
  zIndex: 1000,
  backgroundColor: 'white',
  width: '100%',
});

const pickerContainerStyle = {
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
  margin: '15px 0px 5px 0px',
};

const pickerStyle = {
  background: colors.lightBrown,
};

const headerStyle = {
  display: 'flex',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.brown,
};

const headerTiteStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
};

const headingStyle = {
  color: colors.green,
  fontWeight: 'bold',
  fontSize: '16px',
  margin: '10px',
};

const headerImageStyle = {
  marginLeft: '20px',
};

const headerAddButtonStyle = {
  marginRight: '0px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  marginRight: '20px',
};

const childConteinerStyle = (isSmallScreen) => ({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: '10px',
  marginTop: isSmallScreen ? '15px' : '0px',
  backgroundColor: colors.grayBackground,
});

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
};

const checkmarkContainerStyle = (isCompleted) => ({
  width: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isCompleted ? colors.yellow : colors.lightGreen2,
  borderTopLeftRadius: '10px',
  borderBottomLeftRadius: '10px',
});

const deleteContainerStyle = {
  width: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.orange,
  borderTopRightRadius: '10px',
  borderBottomRightRadius: '10px',
};

export {
  fixedTopContainer,
  headerTrainingStyle,
  checkmarkContainerStyle,
  deleteContainerStyle,
  trainingConteinerStyle,
  iconContainerStyle,
  rowStyle,
  columnStyle,
  dropdownStyle,
  checkboxStyle,
  textStyle,
  textTitleStyle,
  pickerContainerStyle,
  pickerStyle,
  headerStyle,
  headerTiteStyle,
  headingStyle,
  headerImageStyle,
  headerAddButtonStyle,
  childConteinerStyle,
  placeholderStyle,
};
