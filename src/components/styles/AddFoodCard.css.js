/** @jsxImportSource @emotion/react */

import * as colors from './Colors'
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

  // Main container 
  const mainConteinerStyle = {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px 0px 0 0',
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
    justifyContent: 'start',
    alignItems: 'center',
    marginBottom: '2px',
    marginLeft: '10px',
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
    margin: '5px 10px 5px 10px',

 };

  const textTitleStyle = {
    padding: '5px',
    marginLeft: '5px',
    textAlign: 'left',
    fontSize: '15px',
    color: colors.green,
    fontWeight: "bold",
    
  };

 const textStyle = {
    padding: '0px',
    marginRight: '5px',
    textAlign: 'right',
    fontSize: '15px',
    color: colors.green,
    marginRight: '5px',
    width: '60px',
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
    width: '90px',
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
 
  const responsiveMainContainer = styled.div({
    ...rowStyle,
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
    checkboxStyle,
    textStyle,
    textTitleStyle,
    customContainerStyle,
    deleteButonStyle,
    editButonStyle,
    customButtonContainerStyle
};