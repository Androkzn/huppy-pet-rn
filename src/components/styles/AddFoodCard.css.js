/** @jsxImportSource @emotion/react */

import * as colors from './Colors'
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

  // Main container 
  const mainConteinerStyle = {
    alignItems: 'center',
    margin: '5px 0 0 0',
    borderRadius: '10px',
    width: '100%',
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
    justifyContent: 'start',
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
    justifyContent: 'start',
 };

  const textTitleStyle = {
    padding: '5px',
    textAlign: 'left',
    fontSize: '15px',
    color: colors.green,
    fontWeight: "bold",
    
  };

 const textStyle = {
    textAlign: 'right',
    fontSize: '15px',
    color: colors.green,
    padding: '5px',
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
    margin: "0px",
    padding: "5px 5px",
   
 };

 const customTitleStyle = {
  fontSize: '13px',
  color: colors.white,
  fontWeight: "bold",
  fontFamily: "'Balsamiq Sans', sans-serif",
}

  const foodIconContainerStyle = {
    height: '25px',
    margin: "5px 5px"
  };

  const headerTrainingStyle ={
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    minHeight: "50px",
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

  const responsiveMainContainer = styled.div({
    ...rowStyle,
    margin: '5px 10px 5px 10px',
    [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })

  export {
    responsiveMainContainer,
    headerTrainingStyle,
    nameContainerStyle,
    mainConteinerStyle,
    iconContainerStyle, 
    rowStyle, 
    columnStyle,
    dropdownStyle,
    textStyle,
    textTitleStyle,
    customContainerStyle,
    deleteButonStyle,
    editButonStyle,
    customButtonContainerStyle,
    foodIconContainerStyle,
    customTitleStyle,
};