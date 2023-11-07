/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import * as colors from './colors'


const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const loginHeaderStyle = css`
  display: flex;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  background-color: ${colors.brown};
`;

const headingLoginStyle = css`
  color: ${colors.green};
`;

const loginConteinerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px; 
  min-width: 350px; 
  border-radius: 20px;  
  padding: 0px;
  margin: auto;
  background-color: ${colors.lightBrown}
`;

const formStyle = css` 
display: flex;
flex-direction: column;
align-items: center; 
justify-content: center; 
margin-top: 20px;
> div {
  margin: 10px auto;
  width: 100%;
  max-width: 300px;
}
`
const elementsInRow = css`
    display: flex;   
    justify-content: space-between;
    width: 80%;
  `;

const linkForgot = css`
  color: ${colors.black};   
  margin-right: 10px; 
  text-decoration: none; 
`;

const linkSignup = css`
  color: ${colors.orange};   
  margin-right: 10px; 
  text-decoration: none; 
`;

export {containerStyle, loginHeaderStyle, headingLoginStyle, loginConteinerStyle, formStyle, elementsInRow, linkForgot, linkSignup}