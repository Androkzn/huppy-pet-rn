/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import { useLocation, useNavigate } from 'react-router-dom';
import {Image} from './Image.components'
import * as style from './styles/AddFoodCard.css'
import {ButtonImage } from './Buttons.components'
import { deleteFoodTemplate } from "../graphql/graphqlUtils";
import Swipe  from './Swipe.components.tsx';
import * as colors from '../components/styles/Colors';

// Function is responsible for updating the training 
function FoodCard({ food, openAddFoodPage, updateSearchResults }) {
  const { user, setCurrentPage, isSmallScreen } = useContext(UserContext);
  const navigate = useNavigate();
  
  const deleteFoodTemplateHandler = async () => {
    console.log("delet food template",food._id)
    const isDeleted = await  deleteFoodTemplate(user,food._id )  
    if (isDeleted) {
      updateSearchResults()
    }
  }; 
  
  const editFoodHandler = async () => {
    setCurrentPage("editFood")
    navigate("/editFood", { state: { food } });
  };
  
  return (
      <div style={style.mainConteinerStyle} >
         <Swipe
        height={isSmallScreen ? 60 : 50}
        disabled={!food.isCustom} 
        onLeftSwipe={deleteFoodTemplateHandler} 
        leftSwipeComponent={  <Image imageName={`delete_white.svg`} width="30" height="30" />}
        onLeftSwipeConfirm={(onSuccess, onCancel) => {
          if (window.confirm("Do you really want to delete this item ?")) {
            onSuccess();
          } else {
            onCancel();
          }
        }}
        onRightSwipeConfirm={(onSuccess, onCancel) => {
          if (window.confirm("Do you really want to delete this item ?")) {
            onSuccess();
          } else {
            onCancel();
          }
        }}
        distructiveLeftSwipe = {true}
        onRightSwipe={editFoodHandler}
        rightSwipeComponent={  <Image imageName={ `edit_white.svg`} width="20" height="20" />}
        className="my-swiper"
        leftSwipeColor={colors.orange}
        rightSwipeColor={colors.lightGreen2}
      >
        <div style={style.headerTrainingStyle}>
        <div style={style.rowStyle}>
        < style.responsiveMainContainer>
          <div style={style.rowStyle}>
            <div style={style.nameContainerStyle} onClick={() => openAddFoodPage (food)}>
              <span style={style.textTitleStyle}>{food.name}</span>
              <span style={style.textStyle}>{food.calories} kcal</span>
            </div>
          </div> 
          
          <div  style={style.rowStyle}>
          {/* Hides delete/edit buttons and label if food template is no custom */}
          { food.isCustom && (
              <div style={style.nameContainerStyle}> 
               <div style={style.foodIconContainerStyle}>
                 <Image imageName={`${food.categoryType}.png`} width="25" height="25" />
                </div>
                <div style={style.customContainerStyle}>
                  <h6>CUSTOM</h6>
                  <Image imageName="paw_white.png" width="20" height="20" />
                </div>
                {/* Hides delete buttons for small screens */}
                {!isSmallScreen && 
                  <div css={style.deleteButonStyle}>
                    <ButtonImage
                        variant="iconButton"
                        imageName="delete_green.svg"
                        imageSize={25}
                        onClick={() => deleteFoodTemplateHandler()}
                      />
                  </div>
                }
                {/* Hides edit buttons for small screens */}
                {!isSmallScreen && 
                  <div css={style.editButonStyle}>
                    <ButtonImage
                          variant="iconButton"
                          imageName="edit_orange.svg"
                          imageSize={20}
                          onClick={() => editFoodHandler()}
                    />
                  </div> 
                }  
              </div>
            )}
          </div>
          </style.responsiveMainContainer>
          <ButtonImage
              variant="iconButton"
              imageName="arrow_right_green.svg"
              imageSize={20}
              onClick={() => openAddFoodPage (food)}
            />
          </div>
        </div>
        </Swipe>
      </div>
   );
}

export default FoodCard;
