/** @jsxImportSource @emotion/react */

import * as colors from './Colors';
import styled from '@emotion/styled/macro';

// Main container
const mainConteinerStyle = {
  alignItems: 'center',
  margin: '5px 0 0 0',
  borderRadius: '10px',
  width: '100%',
  backgroundColor: colors.lightBrown,
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  width: '100%',
};

const customButtonContainerStyle = {
  ...rowStyle,
  justifyContent: 'start',
  alignItems: 'center',
};

const columnStyle = {
  display: 'flex',
  justifyContent: 'top',
  flexDirection: 'column',
  width: '100%',
};
const nameContainerStyle = {
  ...rowStyle,
  justifyContent: 'start',
  width: '100%',
};

const buttonsContainerStyle = {
  ...rowStyle,
  justifyContent: 'end',
  width: '20%',
};

const foodIconContainerStyle = {
  height: '25px',
  margin: '0px 5px',
};

const textTitleStyle = {
  padding: '5px',
  textAlign: 'left',
  fontSize: '15px',
  color: colors.green,
  fontWeight: 'bold',
};

const textCaloriesStyle = {
  textAlign: 'center',
  fontSize: '13px',
  color: colors.orange,
  padding: '5px',
};

const iconContainerStyle = {
  width: '10%',
};

const deleteButonStyle = {
  color: colors.green,
  marginLeft: '15px',
};

const editButonStyle = {
  color: colors.orange,
};

const customContainerStyle = {
  ...rowStyle,
  justifyContent: 'center',
  width: '25px',
  height: '25px',
  borderRadius: '50%',
  backgroundColor: colors.lightGreen2,
  padding: '5px 10px',
};

const customTitleStyle = {
  fontSize: '12px',
  color: colors.white,
  fontWeight: 'bold',
  fontFamily: "'Balsamiq Sans', sans-serif",
};

const headerTrainingStyle = {
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100%',
  minHeight: '50px',
  backgroundColor: colors.lightBrown2,
};

const dropdownStyle = {
  width: '150px',
  borderRadius: '10px',
  height: '35px',
  paddingRight: '15px',
  paddingLeft: '15px',
  backgroundColor: colors.oliveLight,
  fontFamily: "'Balsamiq Sans', sans-serif",
};

export {
  buttonsContainerStyle,
  headerTrainingStyle,
  nameContainerStyle,
  mainConteinerStyle,
  iconContainerStyle,
  rowStyle,
  columnStyle,
  dropdownStyle,
  textCaloriesStyle,
  textTitleStyle,
  customContainerStyle,
  deleteButonStyle,
  editButonStyle,
  customButtonContainerStyle,
  foodIconContainerStyle,
  customTitleStyle,
};
