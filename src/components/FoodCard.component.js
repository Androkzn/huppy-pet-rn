/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import { useLocation, useNavigate } from 'react-router-dom';
import {Image} from './Image.components'
import * as style from './styles/AddFoodCard.css'
import {ButtonImage } from './Buttons.components'
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
        < style.responsiveMainContainer>
          <div style={style.rowStyle}>
            <div style={style.nameContainerStyle} onClick={() => openAddFoodPage (food)}>
              <span style={style.textTitleStyle}>{food.name}</span>
              <span style={style.textStyle}>{food.calories} kcal</span>
            </div>
          </div> 
          
          <div style={style.customButtonContainerStyle}>
          { food.isCustom && (
              <div style={style.customButtonContainerStyle}> 
                <div css={style.deleteButonStyle}>
                  <ButtonImage
                      variant="iconButton"
                      imageName="delete_green.svg"
                      imageSize={25}
                      onClick={() => deleteFoodTemplateHandler()}
                    />
                </div>
                <div css={style.editButonStyle}>
                  <ButtonImage
                        variant="iconButton"
                        imageName="edit_orange.svg"
                        imageSize={20}
                        onClick={() => editFoodHandler()}
                  />
                </div>    
                <div style={style.customContainerStyle}>
                  <h6>CUSTOM</h6>
                  <Image imageName="paw_white.png" width="20" height="20" />
                </div>
              </div>
            )}
          </div>
          </style.responsiveMainContainer>
          <ButtonImage
              variant="iconButton"
              imageName="arrow_right.svg"
              imageSize={20}
              onClick={() => openAddFoodPage (food)}
            />
          </div>
        </div>
      </div>
   );
}

export default FoodCard;
