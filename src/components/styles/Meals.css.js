/** @jsxImportSource @emotion/react */

import * as colors from './Colors'


const headerMealStyle = {
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.lightBrown2,
};

const headerStyle = {
  display: 'flex',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  alignItems: 'center',
  justifyContent: 'start',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.brown,
  height: "40px",
};

const headerFoodStyle = (isSwiped) => ({
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: isSwiped ? 'start' : 'center',
  textAlign: 'center',
  width: '100%',
});

const headingMealStyle = {
  color: colors.green,
};

const headingFoodStyle = {
  color: colors.green,
  width: '100%',
  textAlign: 'left',
  fontWeight: 'bold',
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

const headerTextStyle = (isSwiped) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '90%',
  alignItems: 'center',
  height: '50px',
  paddingLeft:  isSwiped ? "10px" : "0px",
  transition: "transform 1s ease",
  border: isSwiped ? `1px solid ${colors.orange}` : 'none',
  borderRadius: '15px'
});

const foodListStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  listStyleType: 'none',
  padding: '0px',
};

const foodListRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  listStyleType: 'none',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: colors.white,

};

const inputFieldStyle = {
  border: `2px solid ${colors.grayDark}`,  
  width: '50px',
  marginLeft: '10px',
  marginRight: '10px',
  textAlign: 'center',
  borderRadius: '10px',
  height: '30px',
  fontSize: '16px',
};

const childConteinerStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '5px 0px 5px 0px',
  borderRadius: '10px',
  minWidth:'300px'
};

const headerTiteStyle = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',

};

const headerArrowStyle = {
  margin: "3px 20px 0px 30px"
};

const headingStyle = {
  color: colors.green,
  fontWeight: "bold",
  fontSize: "16px",
  marginRight: '10px',
};

const headerAddButtonStyle = {
  marginRight: '0px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  marginRight: '20px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
};

const bodyMealStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: colors.grayBackground,
  borderBottomLeftRadius: '20px',
  borderBottomRightRadius: '20px',
};

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
};

const addButtonStyle = {
  margin: '0 0 10px 0',
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  flexDirection: 'row',
};

const deleteContainerStyle =  {
  width: '80px',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.orange,
  borderTopRightRadius: '10px',
  borderBottomRightRadius: '10px',
};

const deleteItemStyle = (isSwiped) => ({
  transition: "transform 1s ease",
  border: isSwiped ? `1px solid ${colors.lightGreen}` : 'none',
  borderRadius: '15px'
});

const totalWeightContainerStyle = {
  ...rowStyle,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: '100%',
  marginTop: "10px",
};


const weightLabellStyle = {
  margin: "0px 0px 0px 20px",
  fontWeight: 'bold'
};

const weightValueStyle = {
  margin: "0px 45px 0px 0px",
  fontWeight: 'bold'
};

  
export {
  weightLabellStyle,
  weightValueStyle,
  totalWeightContainerStyle,
  addButtonStyle,
  headerMealStyle,
  headerFoodStyle,
  headingFoodStyle,
  headingMealStyle,
  foodListRowStyle,
  inputFieldStyle,
  foodListStyle,
  headingDeleteButonStyle,
  headingTotalStyle,
  childConteinerStyle,
  headerTextStyle,
  headerStyle,
  headerTiteStyle,
  headerArrowStyle,
  headingStyle,
  headerAddButtonStyle,
  rowStyle,
  bodyMealStyle,
  placeholderStyle,
  deleteContainerStyle,
  deleteItemStyle,
};
