/** @jsxImportSource @emotion/react */

import * as colors from './Colors'
 

const addTrainingFormStyle = {
  maxWidth: '450px',
  minWidth: '250px',
  margin: 'auto',
};

const addTrainingTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
};


const addTrainingButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
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
  addTrainingButtonContainerStyle, 
  addTrainingFormStyle, 
  addTrainingTitleStyle,
  closeButtonContainer,
}