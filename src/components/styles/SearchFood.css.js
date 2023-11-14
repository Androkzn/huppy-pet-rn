/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

  // Main container 
  const mainConteinerStyle = {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    padding: '15px',
    borderRadius: '10px',
    backgroundColor: colors.lightBrown,
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

  const searchContainerStyle = {
    padding: '5px',
    margin: '0px',
    textAlign: 'left',
    fontSize: '20px',
  };

  const buttonsContainerStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    marginTop: '20px',
    textAlign: 'left',
    fontSize: '15px',
  };

  const labelTextFieldStyle = {
    padding: '10px',
    margin: '10px',
    textAlign: 'left',
    fontSize: '20px',
    fontWeight: "bold",
    color: colors.green,
  };

  const textFieldStyle = {
    padding: '5px',
    margin: '0px',
    textAlign: 'left',
    fontSize: '18px',
    borderRadius: '10px',
  };

  const labelFilterStyle = {
    padding: '0px',
    margin: '10px',
    textAlign: 'center',
    fontSize: '18px',
    cursor: "pointer",
    color: colors.green,
    fontWeight: "bold",
  };

 const radioButtonStyle = {
    marginRight: '10px',
    cursor: "pointer",
    color: colors.orange,
    fontSize: '20px', 
  };


  const iconContainerStyle = {
     width: '20%',
  };

  const headerTrainingStyle = {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    height: '80px',
    backgroundColor: colors.lightBrown2,
  };

  const dropdownStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '30px',
    paddingLeft: '10px',
    marginLeft: '10px',
    backgroundColor: colors.oliveLight,
    fontSize: '18px',
  };



  export {
    textFieldStyle,
    searchContainerStyle,
    headerTrainingStyle,
    mainConteinerStyle,
    iconContainerStyle, 
    rowStyle, 
    columnStyle,
    dropdownStyle,
    radioButtonStyle,
    labelFilterStyle,
    labelTextFieldStyle,
    buttonsContainerStyle,
};