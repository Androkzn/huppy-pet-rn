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

const linkContainerStyle = {
  ...rowStyle,
  justifyContent: "start",
  display: 'flex',
  width: '100%',
  alignItems: 'center', 
  margin: "10px 0px 0px 20px",
}

const profileLinkContainerStyle = {
  ...rowStyle,
  justifyContent: "start",
  display: 'flex',
  width: '80%',
  alignItems: 'center', 
  margin: "0px 0px 0px 30px",
}

const linkIconStyle = {
  width: '60px',
  margin: "0px 0px"
}

const avatarIconStyle = {
  
}

const profileIconStyle = {
  width: '40px',
  margin: "5px 5px"
}

const linkTitleStyle = {
  color: colors.green, 
  fontWeight: "bold", 
  margin: "0px 10px"
}

const profileLinkTitleStyle = {
  color: colors.orange, 
  fontWeight: "bold", 
  margin: "0px 10px"
}
 
export {
  pickerContainerStyle,
  pickerStyle,
  rowStyle,
  columnStyle,
  userInfoContainerStyle,
  profileNameStyle,
  linkContainerStyle,
  linkTitleStyle,
  profileLinkTitleStyle,
  linkIconStyle,
  profileIconStyle,
  avatarIconStyle,
  profileLinkContainerStyle,
};
