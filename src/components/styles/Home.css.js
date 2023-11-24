/** @jsxImportSource @emotion/react */
import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

const pickerStyle = {
  // Your styles for picker
};

const pageStyle = {
  maxWidth: '95%',
};

const pickerContainerStyle = {
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
  marginTop: '10px',
  marginBottom: '10px',
};

const headerStyle = {
  display: 'flex',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.brown,
};

const headerTiteStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
};

const headingStyle = {
  color: colors.green,
};

const headerImageStyle = {
  marginLeft: '20px',
};

const headerAddButtonStyle = {
  marginRight: '0px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  marginRight: '20px'
};

const headerTextStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '80%',
};

const childConteinerStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  borderRadius: '20px',
  margin: '5px',
  backgroundColor: colors.grayBackground,
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
};

const columnStyle = {
  flex: '1 0 auto',
  width: '100%',
};

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
};

const columnRightStyle = {
  ...columnStyle,
  borderRadius: '5px',
  marginRight: '5px',
  flex: '0 1 40%',
  
};

const columnLeftStyle = {
  borderRadius: '5px',
  flex: '0 1 60%',
};

const responsiveMainContainer = styled.div({
  ...rowStyle,
   [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
})

const responsiveSubContainer = styled.div({
  ...rowStyle,
   [mq.small]: {
    width: '100%',
    flexDirection: 'column',
  },
})

const chartContainerStyle = {
  ...rowStyle,
  width: '100%',
};

const chartStyle = {
  flex: '0 1 40%',  
  margin: '10px',
};

const chartLegentStyle = {
  flex: '1 1 60%',
  margin: '10px',
};

const statisticContainerStyle = {
  ...columnStyle,
  width: '90%',
};


export {
  statisticContainerStyle,
  chartContainerStyle,
  chartLegentStyle,
  chartStyle,
  pageStyle,
  headerStyle,
  headerAddButtonStyle,
  headerTiteStyle,
  headingStyle,
  placeholderStyle,
  headerImageStyle,
  headerTextStyle,
  childConteinerStyle,
  pickerContainerStyle,
  pickerStyle,
  rowStyle,
  columnRightStyle,
  columnLeftStyle,
  columnStyle,
  responsiveMainContainer,
  responsiveSubContainer
};
