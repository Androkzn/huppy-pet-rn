/** @jsxImportSource @emotion/react */
import * as mq from './Media-queries';
import * as colors from './Colors'
import styled from '@emotion/styled/macro'

  // Main container 
  const mainConteinerStyle = {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px',
    borderRadius: '10px',
    backgroundColor: colors.lightBrown,
    maxHeight: '120px',
    minHeight: '120px',
    width: '100%',
  };

  const fixedTopContainer= (isSmallScreen) => ({
    position: 'sticky',
    top: isSmallScreen ? 60 : 90,
    zIndex: 1000,  
    backgroundColor: 'white',  
    width: '100%',  
  });

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

  const placeholderStyle = {
    ...rowStyle,
    marginTop: '20px',
  }

  const searchContainerStyle = {
    padding: '5px',
    textAlign: 'left',
    fontSize: '20px',
  };

  const buttonsContainerStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    margin: '10px 0 10px 0',
    textAlign: 'center',
    fontSize: '15px',
  };
  const buttonsStyle = {
    ...rowStyle,
    justifyContent: 'space-between',
    textAlign: 'center',
    fontSize: '15px',
  };

  const labelTextFieldStyle = {
    padding: '10px',
    textAlign: 'left',
    fontSize: '18px',
    fontWeight: "bold",
    color: colors.green,
  };

  const clearButonStyle = {
    marginRight: '10px',
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

  const textFieldStyle = {
    padding: '10px',
    height: '40px',
    maxWidth: '250px',
    maxWidth: '250px',
    marginRight: '10px',
    textAlign: 'left',
    fontSize: '18px',
    borderRadius: '10px',
    color: colors.green,
    backgroundColor: colors.white,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  const dropdownStyle = {
    maxWidth: '300px',
    minWidth: '250px',
    borderRadius: '10px',
    height: '40px',
    paddingLeft: '10px',
    marginRight: '10px',
    backgroundColor: colors.white,
    fontSize: '18px',
    color: colors.green,
    fontFamily: "'Balsamiq Sans', sans-serif",
  };

  const responsiveSubContainer = styled.div({
    ...rowStyle,
    [mq.medium]: {
      width: '100%',
      flexDirection: 'column',

    },
     [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })
  
  const responsiveMainContainer = styled.div({
    ...mainConteinerStyle,
    [mq.medium]: {
      paddingLeft: '50px',
      width: 'auto',
      flexDirection: 'row',
      maxHeight: '70px',
      minHeight: '70px',
    },
    [mq.large]: {
      paddingLeft: '50px',
      width: 'auto',
      flexDirection: 'row',
      maxHeight: '70px',
      minHeight: '70px',
    },
  })


  export {
    textFieldStyle,
    placeholderStyle,
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
    clearButonStyle,
    responsiveSubContainer,
    responsiveMainContainer,
    buttonsStyle,
    fixedTopContainer,
};