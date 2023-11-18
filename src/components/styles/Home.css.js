/** @jsxImportSource @emotion/react */
import * as colors from './Colors';

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
  marginTop: '1rem',
  marginBottom: '1rem',
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
  padding: '0px',
  backgroundColor: colors.grayBackground,
  height:'100%',
};

const mealConteinerStyle = {
  ...childConteinerStyle,
  marginRight: '5px'
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
};

const twoColumnStyle = {
  ...rowStyle,
  marginTop: '10px',
  borderRadius: '5px',
};

const columnStyle = {
  borderRadius: '5px',
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
  borderRadius: '5px',
  margin: '5px',
  flex: '0 1 33%',
};

const columnLeftStyle = {
  borderRadius: '5px',
  margin: '5px',
  flex: '0 1 66%',
};

export {
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
  twoColumnStyle,
  mealConteinerStyle,
};
