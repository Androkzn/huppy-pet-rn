/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

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

const descriptionContainerStyle = {
  ...columnStyle,
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  marginTop: '10px',
  backgroundColor: colors.lightBrown,
};

const descriptionStyle = {
  alignItems: 'left',
  textAlign: 'left',
  width: '90%',
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: colors.white,
};

const nutritionRowStyle = {
  ...rowStyle, 
  justifyContent: 'space-between',
  width: '80%',
  margin: '5px',
};

const nutritionContainerStyle = {
  ...columnStyle,
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  marginTop: '10px',
  backgroundColor: colors.lightBrown,
};

const topButtonsContainerStyle = {
  ...rowStyle,
  justifyContent: 'space-between',
  margin: '10px 0 10px 0',
  textAlign: 'center',
  fontSize: '15px',
};

const fixedTopContainer = {
  position: 'sticky',
  top: 80,
  zIndex: 1000,   
  backgroundColor: 'white',  
  width: '100%',
};

const addFoodFormStyle = {
  maxWidth: '450px',
  minWidth: '250px',
  width: '100%',
};

const addFoodTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  fontSize: '17px',
  fontWeight: 'bold',
};

const nutritionFactsTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  margin: '10px',
  fontSize: '17px',
  fontWeight: 'bold',
  cursor: "pointer",
};

const addFoodButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const imageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '10px',
  borderRadius: '10px',
  maxHeigh: "150px",  
  overflow: 'hidden',
};

export {
  columnStyle,
  rowStyle,
  descriptionStyle,
  nutritionRowStyle,
  descriptionContainerStyle,
  nutritionContainerStyle,
  addFoodButtonContainerStyle,
  addFoodFormStyle,
  addFoodTitleStyle,
  nutritionFactsTitleStyle,
  topButtonsContainerStyle,
  imageContainerStyle,
  fixedTopContainer
};
