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
    maxHeight: '150px',
    minHeight: '100px',
    width: '100%',
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
    margin: '20px 0 0 0',
    textAlign: 'center',
    fontSize: '15px',
  };

  const labelTextFieldStyle = {
    padding: '10px',
    textAlign: 'left',
    fontSize: '20px',
    fontWeight: "bold",
    color: colors.green,
  };

  const textFieldStyle = {
    padding: '10px',
    height: '40px',
    maxWidth: '300px',
    marginRight: '10px',
    textAlign: 'left',
    fontSize: '18px',
    borderRadius: '20px',
    color: colors.green,
    backgroundColor: colors.white,
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

  const dropdownStyle = {
    maxWidth: '150px',
    borderRadius: '10px',
    height: '30px',
    paddingLeft: '10px',
    marginLeft: '10px',
    backgroundColor: colors.oliveLight,
    fontSize: '18px',
  };

  const responsiveSubContainer = styled.div({
    ...rowStyle,
    [mq.medium]: {
      width: '100%',
      flexDirection: 'column',
    },
    //flex: '0 1 66%',
     [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })
  
  const responsiveMainContainer = styled.div({
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
};