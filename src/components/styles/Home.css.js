/** @jsxImportSource @emotion/react */
import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

const pickerStyle = {
  background: colors.lightBrown,
};

const pageStyle = {
  maxWidth: '95%',
};

const pickerContainerStyle = {
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
  marginTop: '20px',
  marginBottom: '10px',
};

const headerStyle = {
  display: 'flex',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  alignItems: 'center',
  justifyContent: 'start',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.brown,
  height: "40px",
};

const headerArrowStyle = {
  margin: "3px 20px 0px 30px"
};

const headerTiteStyle = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  textAlign: 'center',
  width: '100%',
};

const headingStyle = {
  color: colors.green,
  fontWeight: "bold",
  fontSize: "16px",
  marginRight: '30px',
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
  marginTop: '10px',
  backgroundColor: colors.grayBackground,
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
};

const columnLeftStyle =  styled.div({
  ...columnStyle,
  flex: '0 1 50%',
  [mq.large]: {
    marginRight: '10px',
  },
  [mq.medium]: {
    marginRight: '10px',
  },
});

const columnRightStyle = {
  ...columnStyle,
  flex: '0 1 50%',
  [mq.large]: {
    marginRight: '10px',
  },
  [mq.medium]: {
    marginRight: '10px',
  },
};

const responsiveSubContainer = styled.div({
  ...rowStyle,
  flex: '0 1 66%',
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

const chartContainerStyle = {
  ...rowStyle,
  width: '100%',
};

const chartStyle = {
  flex: '0 1 100%',  
  margin: 'auto',
  maxWidth: '200px',
};

const chartLegentStyle = {
  flex: '1 1 100%',
  margin: '10px',
  maxWidth: '230px',
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
  responsiveSubContainer,
  headerArrowStyle,
};
