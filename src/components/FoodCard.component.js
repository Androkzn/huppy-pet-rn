/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import {Image} from './Image.components'
import * as style from './styles/AddFood.css'
import {ButtonWithImage, ButtonText } from './Buttons.components'

// Function is responsible for updating the training 
function FoodCard({ food, openAddFoodPage }) {
  return (
      <div style={style.mainConteinerStyle} onClick={() => openAddFoodPage (food)}> 
        <div style={style.headerTrainingStyle} >
          <div style={style.rowStyle}>

            
            <div style={style.nameContainerStyle}>
              <span style={style.textTitleStyle}>{food.name}</span>
              <span style={style.textStyle}>Calories: {food.calories} kcal</span>
            </div>
             

            { food.isCustom && (    
              <div style={style.customContainerStyle}>
                <h6>CUSTOM</h6>
                <Image imageName="paw_white.png" width="20" height="20" />
              </div>
            )}

            <ButtonWithImage
              variant="iconButton"
              imageName="arrow_right.svg"
              imageSize={25}
            >
            </ButtonWithImage>
               
              
          
          </div> 
        </div>
      </div>
   );
}

export default FoodCard;
