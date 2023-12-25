/** @jsxImportSource @emotion/react */

import * as colors from './Colors'
 
const addActivityFormStyle = {
  maxWidth: '450px',
  minWidth: '250px',
  margin: 'auto',
};

const addActivityTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0px"
};

const addActivityButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
};

const estimatedCaloriesContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '10px', 
  backgroundColor: `${colors.lightBrown2}`,
  color: `${colors.orange}`,
};

const burnedCaloriesStyle = {
  marginRight: '5px',
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

const circleButtonsGroupStyle = {
  display: 'flex',
  alignItems: 'center',
};

const closeButtonContainer = {
  display: 'flex',
  justifyContent: 'flex-end',  
};

const textFieldStyle = {
  border: `2px solid ${colors.green}`,  
  width: '50px',
  textAlign: 'center',
  marginRight: '15px',
  marginLeft: '15px',
  borderRadius: '10px',
  height: '30px',
  fontSize: '16px',
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
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'column',
  width: '100%',
};

export { 
  rowStyle,
  columnStyle,
  containerStyle,
  textFieldStyle, 
  circleButtonsGroupStyle,  
  addActivityButtonContainerStyle, 
  addActivityFormStyle, 
  addActivityTitleStyle,
  closeButtonContainer,
  estimatedCaloriesContainerStyle,
  burnedCaloriesStyle,
}