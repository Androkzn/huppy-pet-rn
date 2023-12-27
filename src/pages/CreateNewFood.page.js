/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { DataContext } from "../contexts/user.context";
import NewFoodForm from "../components/NewFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from '@mui/material';
import AddImageDialog from "../components/AddImageDialog.component";
import {useAddFoodTemplate} from "../hooks/query.hooks"

const CreateNewFood = () => {
  const { user, setCurrentPage, currentDate } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mealId, setMealId] = useState(location.state?.mealId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const [image, setImage] = useState(null);
  const {mutate: addFoodTemplateMutation} = useAddFoodTemplate()

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
      return <AddImageDialog  
        foodItem={foodItem} 
        onClose={closeDialog} 
        setFoodItem={setFoodItem}
        image={image}
        setImage={setImage}
      />
    } else if (dialogType === "error") {
      
    } 
  };
  
  // Some prefilled form state
  const [foodItem, setFoodItem] = useState({
    _id : "",
    name: "",
    image: null,
    type: "food",
    units: "gram",
    categoryType: "meat",
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 100,
    bonesRatio: 0,
    desc: "",
    weight: 0,
  });

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      setMealId(location.state.mealId)
    }
  }, [location.state]);

  // addFood function is responsible for adding the Food
  const addNewFood = async (event) => {
    const { name} = event.target;

    if ( foodItem.name.length === 0 || foodItem.calories  === 0   ) {
      return;
    }

    addFoodTemplateMutation(
      {
        user: user,
        foodItem: foodItem,
      },
      {
        onSuccess: (data) => {
          const templateId = data?.templateId;
          if (name === 'createAndAddFood') {
            foodItem._id = templateId
            setCurrentPage("addFood")
            navigate("/addFood", { state: { mealId, foodItem } });
          } else {
            setCurrentPage("searchFood")
            navigate("/searchFood");
          }
        },
      }
    );
  };

  //Callback func that opens image dialog 
  const updateImage = async () => {
    openDialog("image")
  };

  return <PageContainer>
    <div  style={styles.fixedTopContainer}>
      <div  style={styles.topButtonsContainerStyle}>
        <ButtonLink
            variant="backButton"
            to="/searchFood"
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
          Back
        </ButtonLink>
        <div  css={styles.addFoodTitleStyle}>{"Add New Food"}</div>
        <div style={{width: '100px'}}></div>
      </div>
    </div>
    <NewFoodForm 
      addNewFood={addNewFood} 
      foodItem={foodItem} 
      setFoodItem={setFoodItem} 
      updateImage={updateImage} 
      image={image}
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

export default CreateNewFood;