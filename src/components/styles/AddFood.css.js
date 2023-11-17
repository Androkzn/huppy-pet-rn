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
  marginTop: '20px',
  textAlign: 'left',
  fontSize: '15px',
};

const addFoodFormStyle = {
  maxWidth: '450px',
  minWidth: '350px',
  margin: 'auto',
};

const addFoodTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
};

const nutritionFactsTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  marginRight: '10px',
  cursor: "pointer",
};

const addFoodButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const imageContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '10px',
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
};
