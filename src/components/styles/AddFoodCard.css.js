/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

  // Main container 
  const mainConteinerStyle = {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px 0px 0 0px',
    padding: '10px',
    borderRadius: '10px',
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
    justifyContent: 'center',
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
    justifyContent: 'left',

 };

  const textTitleStyle = {
    padding: '5px',
    marginLeft: '5px',
    textAlign: 'left',
    fontSize: '15px',
    color: colors.green,
    fontWeight: "bold"
  };

 const textStyle = {
    padding: '0px',
    marginRight: '5px',
    textAlign: 'left',
    fontSize: '15px',
    color: colors.green,
    marginRight: '5px',
  };

  const iconContainerStyle = {
     width: '10%',
  };

  const deleteButonStyle = {
    color: colors.green,
    marginRight: '10px'
  };

  const editButonStyle = {
    color: colors.orange,
    marginRight: '10px'
  };

  const customContainerStyle = {
    ...rowStyle,
    justifyContent: 'center',
    width: '100px',
    height: '25px',
    borderRadius: '10px',
    backgroundColor: colors.lightGreen2,
 };

  const headerTrainingStyle ={
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    backgroundColor: colors.lightBrown2,
  };

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
    nameContainerStyle,
    mainConteinerStyle,
    iconContainerStyle, 
    rowStyle, 
    columnStyle,
    dropdownStyle,
    checkboxStyle,
    textStyle,
    textTitleStyle,
    customContainerStyle,
    deleteButonStyle,
    editButonStyle,
    customButtonContainerStyle
};