/** @jsxImportSource @emotion/react */

import * as colors from './Colors';

const containerStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: colors.lightBrown,
};

const loginHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  marginTop: '200px',
  fontSize: '25px',
  fontWeight: 'bold',

};

const headingLoginStyle = {
  color: colors.green,
  width: "170px"
};

const loginConteinerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '350px',
  minWidth: '300px',
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
  textDecoration: 'none',
};

const linkSignup = {
  color: colors.orange,  
  textDecoration: 'none',
};

export { containerStyle, loginHeaderStyle, headingLoginStyle, loginConteinerStyle, formStyle, elementsInRow, linkForgot, linkSignup };
