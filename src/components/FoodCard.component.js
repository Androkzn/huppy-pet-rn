/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import { useLocation, useNavigate } from 'react-router-dom';
import {Image} from './Image.components'
import * as style from './styles/AddFoodCard.css'
import {ButtonWithImage } from './Buttons.components'
import { Delete, Edit} from "@mui/icons-material";
import { deleteFoodTemplate } from "../graphql/graphqlUtils";

// Function is responsible for updating the training 
function FoodCard({ food, openAddFoodPage, updateSearchResults }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const deleteFoodTemplateHandler = async () => {
    console.log("delet food template",food._id)
    const isDeleted = await  deleteFoodTemplate(user,food._id )  
    if (isDeleted) {
      updateSearchResults()
    }
  }; 
  
  const editFoodHandler = async () => {
    navigate("/editFood", { state: { food } });
  };
  
  return (
      <div style={style.mainConteinerStyle} > 
        <div style={style.headerTrainingStyle}>
          <div style={style.rowStyle}>

            <div style={style.nameContainerStyle} onClick={() => openAddFoodPage (food)}>
              <span style={style.textTitleStyle}>{food.name}</span>
              <span style={style.textStyle}>{food.calories} kcal</span>
            </div>
             
            { food.isCustom && (
              <div style={style.customButtonContainerStyle}> 
                <div css={style.deleteButonStyle}><Delete onClick={() => deleteFoodTemplateHandler()} /></div>
                <div css={style.editButonStyle}><Edit onClick={() => editFoodHandler()} /></div>    
                <div style={style.customContainerStyle}>
                  <h6>CUSTOM</h6>
                  <Image imageName="paw_white.png" width="20" height="20" />
                </div>
              </div>
            )}

            <ButtonWithImage
              as="button"
              variant="iconButton"
              imageName="arrow_right.svg"
              imageSize={20}
              onClick={() => openAddFoodPage (food)}
            >
            </ButtonWithImage>
               
              
          
          </div> 
        </div>
      </div>
   );
}

export default FoodCard;
