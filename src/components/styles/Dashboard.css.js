/** @jsxImportSource @emotion/react */

import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro';

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
});

const responsiveMainContainer = styled.div({
  ...rowStyle,
  [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
});

const SelectDateContainer = styled.div({
  ...columnStyle,
  marginTop: '15px',
  marginBottom: '15px',
  width: '100%',
  [mq.small]: {
    marginBottom: '0px',
  },
});

const fixedTopContainer = (isSmallScreen) => ({
  position: 'sticky',
  top: isSmallScreen ? 60 : 60,
  zIndex: 1000,
  backgroundColor: 'white',
  width: '100%',
});

const datePickerContainerStyle = {
  ...rowStyle,
  width: '95%',
  justifyContent: 'center',
};

const datePickerStyle = {
  margin: '0px 20px 10px 20px',
};

const placeholderContainerStyle = {
  margin: '100px 0px',
};

const chartContainerStyle = {
  width: '100%',
  alignItems: 'center',
  textAlign: 'center',
};

export {
  fixedTopContainer,
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
