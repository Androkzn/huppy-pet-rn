/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

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
    minWidth:'300px'
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
    padding: '5px',
    margin: '0px',
    textAlign: 'left',
    fontSize: '20px',
    color: colors.green,
  };

 const textStyle = {
    padding: '5px',
    margin: '0px',
    textAlign: 'left',
  };

 

  const iconContainerStyle = {
     width: '20%',
  };

  const headerTrainingStyle = (isCompleted) => ({
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    height: '80px',
    backgroundColor: isCompleted ? colors.lightGreen2 : colors.lightBrown2,
  });

  const dropdownStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '35px',
    paddingRight: '15px',
    paddingLeft: '15px',
    backgroundColor: colors.oliveLight,
  };

  const checkboxStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '35px',
  };

  export {
    headerTrainingStyle,
    trainingConteinerStyle,
    iconContainerStyle, 
    rowStyle, 
    columnStyle,
    dropdownStyle,
    checkboxStyle,
    textStyle,
    textTitleStyle,
};