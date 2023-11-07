/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import * as colors from './colors'
 
const headerMealStyle = css`
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 95%;
  margin-top: 10px;
  background-color: ${colors.lightBrown2};
`;

const headerFoodStyle = css`
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  margin-top: 0px;
  background-color: ${colors.lightBrown2};
`;

 

const headingMealStyle = css`
  color: ${colors.green};
`;

const headingFoodStyle = css`
  color: ${colors.green};
  width: 100%;
  text-align: left;
`;

const headingTotalStyle = css`
  display: flex;
  align-items: center; 
  color: ${colors.green};
  background-color: ${colors.blueLight};
  padding: 5px;
  border-radius: 10px;  
`;

const headingDeleteButonStyle = css`
  color: ${colors.green};
`;

const headerTextStyle = css`
  display: flex;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  margin: 0px;
  height: 50px;
`;

const foodListStyle = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
`;

const foodListRowStyle = css`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${colors.lightBrown2};
`;

const inputFieldStyle = css`
  width:40px;
  margin-left: 10px;
  margin-right: 10px;
`;
 
 
const childConteinerStyle = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  border-radius: 10px;  
  background-color: ${colors.lightBrown}
`;

export { headerMealStyle, headerFoodStyle, headingFoodStyle, headingMealStyle, foodListRowStyle, inputFieldStyle, foodListStyle, headingDeleteButonStyle, headingTotalStyle, childConteinerStyle, headerTextStyle }