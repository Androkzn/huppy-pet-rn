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
  backgroundColor: colors.red,
  color: colors.white,
  marginTop: '10px',
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '20px',
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

const backButtonContainerStyle = {
  ...rowStyle,
  justifyContent: 'space-between',
  margin: '20px 0 10px 0',
  textAlign: 'left',
  fontSize: '15px',
};

const saveButtonContainerStyle = {
  ...rowStyle,
  justifyContent: 'center',
  marginTop: '20px',
  textAlign: 'left',
  fontSize: '15px',
};

const profileFormStyle = {
  maxWidth: '30%',
  minWidth: '100%',
};
const profileTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  fontSize: '17px',
  fontWeight: 'bold',
}
const nameStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
  margin: 'auto',
};

const ageStyle = {
  textAlign: 'center',
  color: colors.black,
  backgroundColor: colors.blueLight,
  borderRadius: '10px',
  padding: '5px',
  width: '50%',
  margin: 'auto',
  marginTop: '10px',
  marginBottom: '10px',
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
  width: '100%',
  textAlign: 'center',
  margin: 'auto',
};

const dialogLargeContainerStyle = {
  maxWidth: '450px',
  minWidth: '250px',
  maxHeight: '550px',
  margin: 'auto',
};

const closeDialogButtonContainer = {
  display: 'flex',
  justifyContent: 'flex-end',  
};

const dialogTitleStyle = {
  textAlign: 'center',
  color: colors.lightGreen,
};

const avatarContainerStyle = {
  maxWidth: '250px',
  minWidth: '250px',
  margin: 'auto',
  textAlign: 'center',
}


const leftDialogButtonStyle = {
  marginRight: '20px',
}

const dialogButtonContainerStyle = (isSingleButton) => ({
  display: 'flex',
  justifyContent: isSingleButton ? 'center' : 'space-between',
  marginTop: '20px' 
});

export {
  columnStyle,
  rowStyle,
  foodRatioExpandedContainerStyle,
  recommendedCaloriesStyle,
  foodRatioContainerStyle,
  nutritionContainerStyle,
  addFoodButtonContainerStyle,
  profileFormStyle,
  nameStyle,
  ageStyle,
  profileTitleStyle,
  nutritionFactsTitleStyle,
  backButtonContainerStyle,
  saveButtonContainerStyle,
  imageContainerStyle,
  selectedCategoriesContainerStyle,
  chartContainerStyle,
  unselectedCategoriesContainerStyle,
  unselectedFoodCategoryStyle,
  unusedCaloriesReminderStyle,
  dialogLargeContainerStyle,
  closeDialogButtonContainer,
  dialogTitleStyle,
  dialogButtonContainerStyle,
 avatarContainerStyle,
 leftDialogButtonStyle
};
