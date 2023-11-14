/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import * as colors from './Colors'
 
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

const addButtonStyle = css`
  background:  ${colors.lightGreen}; 
  border: none;
  border-radius: 10px;  
  cursor: pointer;
  width: 150px;
  height: 35px;
  margin-bottom: 10px;
 
  &:hover {
    background: ${colors.orange}; 
    
  }

  color:  ${colors.white}
`;

const addButtonTitleStyle = css`
  margin: 0px; 
  margin-left: 10px;
  color:  ${colors.white}
`;

const addButtonContentStyle = css`
  display: flex;
  align-items: center;
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
  background-color: ${colors.oliveLight};
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

export { headerMealStyle, headerFoodStyle, addButtonStyle, addButtonTitleStyle, addButtonContentStyle, headingFoodStyle, headingMealStyle, foodListRowStyle, inputFieldStyle, foodListStyle, headingDeleteButonStyle, headingTotalStyle, childConteinerStyle, headerTextStyle }