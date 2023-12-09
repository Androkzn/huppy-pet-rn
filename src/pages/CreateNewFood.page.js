/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import NewFoodForm from "../components/NewFoodForm.component";
import {ButtonLink} from '../components/Buttons.components'
import { addFoodTemplate } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from '@mui/material';
import AddImageDialog from "../components/AddImageDialog.component";

const CreateNewFood = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mealId, setMealId] = useState(location.state?.mealId);
  const [selectedDate, setSelectedDate] = useState(location.state?.selectedDate);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  
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
      return <AddImageDialog  foodItem={foodItem} onClose={closeDialog} setFoodItem= {setFoodItem}/>
    } else if (dialogType === "error") {
      
    } 
  };
  
  // Some prefilled form state
  const [foodItem, setFoodItem] = useState({
    _id : "",
    name: "",
    type: "",
    units: "",
    categoryType: "",
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 0,
    bonesRatio: 0,
    desc: "",
    weight: 0,
  });

  useEffect(() => {
    // Fetch or set foodItem if it's not available
    if (!foodItem && !mealId && location.state) {
      setMealId(location.state.mealId)
      setSelectedDate(location.state.selectedDate)
    }
  }, [location.state]);

  // addFood function is responsible for adding the Food
  const addNewFood = async (event) => {
    const { name} = event.target;

    if ( foodItem.name.length === 0 || foodItem.calories  === 0   ) {
      return;
    }
    const {success, templateId }= await addFoodTemplate(user, foodItem)  
    
    if (success) {
      // Function to open the AddFoodPage when a food item is clicked
      if (name === 'createAndAddFood') {
        foodItem._id = templateId
        console.log("CreateNewFood", foodItem)
        console.log("mealId", mealId)
        navigate("/addFood", { state: { mealId, foodItem } });
      } else {
        navigate("/searchFood");
      }
    }
  };

  //Callback func that opens image dialog 
  const updateImage = async () => {
    openDialog("image")
  };

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonLink
          variant="backButton"
          to="/searchFood"
          imageName="arrow_left.svg"
          imageSize={20}
        >
         Back
      </ButtonLink>
      <div  css={styles.addFoodTitleStyle}>{"Add New Food"}</div>
      <div style={{width: '100px'}}></div>
    </div>
    <NewFoodForm addNewFood={addNewFood} foodItem={foodItem} setFoodItem={setFoodItem} updateImage={updateImage} />
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