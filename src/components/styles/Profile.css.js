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

const foodRatioContainerStyle = {
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

const unselectedFoodCategoryStyle = {
  display: 'flex',
  borderRadius: '10px',
  alignItems: 'center',
  justifyContent: 'stretch',
  textAlign: 'center',
  width: '100%',
  flexWrap: 'wrap', 
};

const unusedCaloriesReminderStyle  = {
  textAlign: 'center',
  width: '50%',
  margin: 'auto',
  padding: '10px',
  borderRadius: '10px',
  fontWeight: 'bold',
  fontSize: '18px',
  backgroundColor: colors.orange,
};

const foodRatioExpandedContainerStyle = {
  alignItems: 'left',
  textAlign: 'left',
  width: '90%',
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: colors.white,
};


const chartContainerStyle = {
  margin: '10px',
  backgroundColor: colors.blueLight,
};

const selectedCategoriesContainerStyle = {
  margin: '10px',
};

const unselectedCategoriesContainerStyle = {
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: colors.white,
};

const recommendedCaloriesStyle = {
  ...rowStyle, 
  justifyContent: 'space-between',
  width: '95%',
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
  maxWidth: '30%',
  minWidth: '90%',
};
const profileTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
}
const nameStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
};

const ageStyle = {
  textAlign: 'center',
  color: colors.black,
  backgroundColor: colors.blueLight,
  borderRadius: '10px',
  padding: '5px',
  width: '50%',
  margin: 'auto',
  marginBottom: '15px',
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
  ...columnStyle,
  justifyContent: 'center',
  marginBottom: '10px',
  width: '30%',
  margin: 'auto',
};



export {
  columnStyle,
  rowStyle,
  foodRatioExpandedContainerStyle,
  recommendedCaloriesStyle,
  foodRatioContainerStyle,
  nutritionContainerStyle,
  addFoodButtonContainerStyle,
  addFoodFormStyle,
  nameStyle,
  ageStyle,
  profileTitleStyle,
  nutritionFactsTitleStyle,
  topButtonsContainerStyle,
  imageContainerStyle,
  selectedCategoriesContainerStyle,
  chartContainerStyle,
  unselectedCategoriesContainerStyle,
  unselectedFoodCategoryStyle,
  unusedCaloriesReminderStyle
};
