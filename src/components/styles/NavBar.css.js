/** @jsxImportSource @emotion/react */
import * as colors from './Colors';

const pickerStyle = {
  margin: '0 15px 0 15px',
};

 
const pickerContainerStyle = {
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
  marginTop: '5px',
  marginBottom: '5px',
  marginLeft: '50px',
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

const userInfoContainerStyle = (isSmallScreen) => ({
  //margin: "auto", 
  justifyContent: "flex-end",
  display: 'flex',
  width: '100%',
  alignItems: 'center', 
  textAlign: 'center'
});

const profileNameStyle = {
  textDecoration: "none", 
  cursor: 'pointer', 
  margin: "auto 10px auto auto", 
  color: colors.green, 
  fontWeight: "bold", 
  alignItems: 'center', 
  textAlign: 'center'
};
 
export {
  pickerContainerStyle,
  pickerStyle,
  rowStyle,
  columnStyle,
  userInfoContainerStyle,
  profileNameStyle,
};
