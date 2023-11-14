/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import * as colors from './Colors'

const pickerStyle = css`   
`;

const pickerContainerStyle = css`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  margin-top: 1rem; 
  margin-bottom: 1rem; 
`;

const headerStyle = css`
  display: flex;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  background-color: ${colors.brown};
`;

const headerTiteStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const headingStyle = css`
  color: ${colors.green};
`;

const headerImageStyle = css`
  margin-left: 20px; 
`;

const headerAddButtonStyle = css`
  margin-right: 20px; 
  background: transparent;  
  border: none;
  cursor: pointer;
`;

const headerTextStyle = css`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

const childConteinerStyle = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 20px;  
  padding: 0px;
  margin-top: 1rem; 
  background-color: ${colors.grayBackground}
`;

const rowStyle = css`
  display: flex;
  flex-direction: row;
`;

const twoColumnStyle  = css`
  min-height: 30px;
  border-radius: 5px;
  margin: 5px;
  flex: 1 0 auto;
  width: 48%;
`;

const columnStyle  = css`
  min-height: 30px;
  border-radius: 5px;
  flex: 1 0 auto;
  width: 100%;
`;

const placeholderStyle  = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const columnRightStyle  = css`
  min-height: 30px;
  border-radius: 5px;
  margin: 5px;
  flex: 0 1 33%;
  width: 48%;
`;

const columnLeftStyle = css`
  min-height: 30px;
  border-radius: 5px;
  margin: 5px;
  flex: 1 0 auto;
  width: 48%;
`;

export { headerStyle, headerAddButtonStyle, headerTiteStyle, headingStyle, placeholderStyle, headerImageStyle, headerTextStyle, childConteinerStyle, pickerContainerStyle, pickerStyle, rowStyle, columnRightStyle, columnLeftStyle, columnStyle, twoColumnStyle }