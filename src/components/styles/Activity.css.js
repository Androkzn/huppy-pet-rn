/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

  // Main container 
  const activityConteinerStyle = {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '10px',
    padding: '5px',
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

  const topRowStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const bottomRowStyle = {
    ...rowStyle,
    justifyContent: 'left',
    color: `${colors.orange}`,
    fontWeight: "bold",
  };

  const bodyRowStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    marginLeft: '10px',
  };
  
  const columnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  
    marginLeft: '10px',
  };

  const iconContainerStyle = {
     width: '20%',
  };

  const headerActivityStyle = {
    display: 'flex',
    direction: 'row',
   
    textAlign: 'center',
    width: '100%',
    height: '80px',
    backgroundColor: colors.lightBrown2,
  };

  const bodyActivityStyle = {
    display: 'flex',
    textAlign: 'center',
    width: '100%',
    height: '60px',
    backgroundColor: colors.lightBrown2,
  };
  
  const inputFieldStyle = {
    border: `2px solid ${colors.grayDark}`,  
    width: '40px',
    textAlign: 'center',
    marginRight: '15px',
    marginLeft: '15px',
    borderRadius: '10px',
    height: '30px',
    fontSize: '16px',
    fontFamily: "'Balsamiq Sans', sans-serif",
  };
  
  const dropdownStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '35px',
    paddingRight: '15px',
    paddingLeft: '15px',
    backgroundColor: colors.white,
    fontFamily: "'Balsamiq Sans', sans-serif",
    color: colors.green,
    fontSize: '15px',
    maxWidth: '150px',
  };

  const dropdownItemStyle = {
  };

  export {
    headerActivityStyle,
    bodyActivityStyle,
    inputFieldStyle,
    activityConteinerStyle,
    iconContainerStyle, 
    rowStyle, 
    topRowStyle,
    bottomRowStyle,
    bodyRowStyle,
    columnStyle,
    dropdownStyle,
    dropdownItemStyle
};