/** @jsxImportSource @emotion/react */

import * as colors from './Colors';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  flexDirection: 'column',
  height: '70vh',
};

const loginHeaderStyle = {
  display: 'flex',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  backgroundColor: colors.brown,
};

const headingLoginStyle = {
  color: colors.green,
};

const loginConteinerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '350px',
  minWidth: '300px',
  borderRadius: '20px',
  padding: '0px',
  margin: 'auto',
  backgroundColor: colors.lightBrown,
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '20px',
  '> div': {
    margin: '10px auto',
    maxWidth: '400px',
    minWidth: '350px',
  },
};

const elementsInRow = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '80%',
};

const linkForgot = {
  color: colors.black,
  marginRight: '10px',
  textDecoration: 'none',
};

const linkSignup = {
  color: colors.orange,
  marginRight: '10px',
  textDecoration: 'none',
};

export { containerStyle, loginHeaderStyle, headingLoginStyle, loginConteinerStyle, formStyle, elementsInRow, linkForgot, linkSignup };
