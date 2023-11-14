/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import * as colors from './Colors'
 
const headerMealStyle = {
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '95%',
  marginTop: '10px',
  backgroundColor: colors.lightBrown2,
};

const headerFoodStyle = {
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  marginTop: '0px',
  backgroundColor: colors.lightBrown2,
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
};

const addFoodButtonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const headingMealStyle = {
  color: colors.green,
};

const headingFoodStyle = {
  color: colors.green,
  width: '100%',
  textAlign: 'left',
};

const headingTotalStyle = {
  display: 'flex',
  alignItems: 'center',
  color: colors.green,
  backgroundColor: colors.oliveLight,
  padding: '5px',
  borderRadius: '10px',
};

const headingDeleteButonStyle = {
  color: colors.green,
};

const headerTextStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '90%',
  alignItems: 'center',
  margin: '0px',
  height: '50px',
};

const foodListStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  listStyleType: 'none',
  padding: '0',
};

const foodListRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  listStyleType: 'none',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: '10px',
  marginTop: '5px',
  marginLeft: '10px',
  marginRight: '10px',
  backgroundColor: colors.lightBrown2,
};

const inputFieldStyle = {
  width: '40px',
  marginLeft: '10px',
  marginRight: '10px',
};

const childConteinerStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
  borderRadius: '10px',
  backgroundColor: colors.lightBrown,
};

export {
  headerMealStyle,
  addFoodButtonContainerStyle,
  headerFoodStyle,
  addFoodFormStyle,
  addFoodTitleStyle,
  headingFoodStyle,
  headingMealStyle,
  foodListRowStyle,
  inputFieldStyle,
  foodListStyle,
  headingDeleteButonStyle,
  headingTotalStyle,
  childConteinerStyle,
  headerTextStyle,
  nutritionFactsTitleStyle,
};
