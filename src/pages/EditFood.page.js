/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import EditFoodForm from "../components/EditFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from '@mui/material';
import ChangeImageDialog from "../components/ChangeImageDialog.component";
import {useUpdateFoodTemplate} from "../hooks/query.hooks"

const EditFood = () => {
  const { user, setCurrentPage } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { food } = location.state || {};
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const {mutate: updateFoodTemplateMutation} = useUpdateFoodTemplate()
   
  // Function to load state from localStorage
  const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Opens dialog 
  const openDialog = (dialogTypeNew) => {
    setDialogType(dialogTypeNew)
    setDialogOpen(true);
  };

  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    if (dialogType === "image") { 
      return <ChangeImageDialog  
        foodItem={foodItem} 
        onClose={closeDialog} 
        setFoodItem= {setFoodItem}
      />
    } else if (dialogType === "error") {
      
    } 
  };

  const cachedFood = loadState('foodEdited', {
    _id : food?._id,
    name: food?.name,
    type: food?.type,
    units: food?.units,
    categoryType: food?.categoryType,
    protein: food?.protein,
    fat: food?.fat,
    fiber: food?.fiber,
    ash: food?.ash,
    carb: food?.carb,
    calories: food?.calories,
    servings: food?.servings,
    caloriesServing: food?.caloriesServing,
    servingWeight: food?.servingWeight,
    meatRatio: food?.meatRatio,
    bonesRatio: food?.bonesRatio,
    desc: food?.desc,
    weight: food?.weight,
  });

const [foodItem, setFoodItem] = useState(food|| cachedFood)

  // addFood function is responsible for editing the Food
  const editFood = async () => {
    if ( foodItem.name.length === 0 || foodItem.calories  === 0   ) {
      return;
    }

    updateFoodTemplateMutation(
      {
        user: user,
        foodItem: foodItem,
      },
      {
        onSuccess: () => {
          setCurrentPage("searchFood")
          navigate("/searchFood");
        },
      }
    );   
  };

  //Callback func that opens image dialog 
  const updateImage = async () => {
    openDialog("image")
  };

   // Updates food
   const getFood = async () => {
    if (food) {
      setFoodItem(food)
      saveState('foodEdited', food);
      return food  
    } else {
      setFoodItem(cachedFood)
      return  cachedFood 
  }
}


    // Save the profile to local storage whenever it changes
    useEffect(() => {
      getFood()
    }, [food]);

  return <PageContainer>
    <div style={styles.fixedTopContainer}> 
      <div  style={styles.topButtonsContainerStyle}>
        <ButtonLink
            variant="backButton"
            to="/searchFood"
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
          Back
        </ButtonLink>
        <div  css={styles.addFoodTitleStyle}>{"Edit Food"}</div>
        <div style={{width: '100px'}}></div>
      </div>
    </div>
    <EditFoodForm 
      editFood={editFood} 
      foodItem={foodItem} 
      setFoodItem={setFoodItem} 
      updateImage={updateImage}
    />
    
    {/* Dialog */}
    {dialogOpen && (          
      <Dialog open={dialogOpen} >
        <DialogContent>
          {getDialogContent()}
          </DialogContent>
      </Dialog>
    )}
  
  </PageContainer>
}

export default EditFood;