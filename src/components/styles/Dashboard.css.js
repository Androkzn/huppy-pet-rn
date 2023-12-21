/** @jsxImportSource @emotion/react */

import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

const rowStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  };
   
  const columnStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  };
  
 
  const responsiveSubContainer = styled.div({
    ...rowStyle,
    justifyContent: 'center',
     [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })
  
  const responsiveMainContainer = styled.div({
    ...rowStyle,
    [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })

  const SelectDateContainer = styled.div({
    ...rowStyle,
    marginTop: '15px',
    width: '60%',
    [mq.small]: {
      width: '100%',
      flexDirection: 'column',
    },
  })

  const datePickerContainerStyle = {
    ...rowStyle,
    width: '95%',
    justifyContent: 'center',
  };

  const datePickerStyle = {
    margin: '10px 10px',
  };

  const placeholderContainerStyle = {
    margin: '100px 0px',
  };

  const chartContainerStyle = {
    width: '90%',
    alignItems: 'center',
    textAlign: 'center',
  };
  
  export {
    chartContainerStyle,
    placeholderContainerStyle,
    datePickerContainerStyle,
    SelectDateContainer,
    rowStyle,
    columnStyle,
    responsiveMainContainer,
    responsiveSubContainer,
    datePickerStyle, 
  };