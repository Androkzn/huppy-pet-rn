/** @jsxImportSource @emotion/react */

import * as colors from './Colors'

  // Main container 
  const activityConteinerStyle = {
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

  const topRowStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    marginBottom: '10px',
    marginRight: '10px'
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
    marginRight: '10px',
    marginLeft: '10px'
  };
  
  const columnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    marginRight: '10px',
  };

  const iconContainerStyle = {
     width: '20%',
  };

  const headerActivityStyle = {
    display: 'flex',
    irection: 'row',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    height: '80px',
    backgroundColor: colors.lightBrown2,
  };

  const bodyActivityStyle = {
    display: 'flex',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    height: '60px',
    backgroundColor: colors.lightBrown2,
    marginTop: '10px',
  };
  
  const inputFieldStyle = {
    border: `2px solid ${colors.green}`,  
    width: '50px',
    textAlign: 'center',
    marginRight: '15px',
    marginLeft: '15px',
    borderRadius: '10px',
    height: '30px',
  };
  
  const dropdownStyle = {
    width: '150px',
    borderRadius: '10px',
    height: '35px',
    paddingRight: '15px',
    paddingLeft: '15px',
    backgroundColor: colors.oliveLight,
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