/** @jsxImportSource @emotion/react */
import * as colors from './Colors';
import * as mq from './Media-queries';
import styled from '@emotion/styled/macro'

const pickerStyle = {
  margin: '0 15px 0 15px',
};

 
const pickerContainerStyle = {
  display: 'flex',
  flex: '1 1 auto',
  justifyContent: 'center',
  marginTop: '15px',
  marginBottom: '15px',
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
  alignItems: "right",
  justifyContent: "flex-end",
  display: 'flex',
  width: isSmallScreen ? '60px' : '100%',  
});

const profileNameStyle = {
  textDecoration: "none", 
  cursor: 'pointer', 
  margin: "auto 0 auto 0", 
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
