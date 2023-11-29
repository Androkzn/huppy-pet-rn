/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import RegisterForm from "../components/RegisterForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addProfile } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setProfiles, setCurrentProfile } = useContext(UserContext);
  const [isFormCompleated, setIsFormCompleated] = useState(false);
  const [customFoodCategories, setCustomFoodCategories] = useState([]);

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  let newProfile = {
    _id : "",
    name: "",
    activityType: "active",
    avatar: "",
    breed: "",
    categories: [customFoodCategories],
    dailyPortion: 250,
    dailyRatio: 5,
    weight: 5,
    deductCalories: false,
    dob: (new Date()).toISOString(),
    isCurrent: true,
    preset: "barfAdult",
    size: "small",
    userId: user.id,
    isRatioSelected: false,
  }

  // Some prefilled form state
  const [profile, setProfile] = useState(newProfile);

// Adds new Food Category
const addCategory= async (category) => {
  // Create a new array by copying the existing customFoodCategories and adding the new category
  const updatedCategories = [...customFoodCategories, category];
  // Update the state with the new array of custom food categories
  setCustomFoodCategories(updatedCategories);
};

// Deletes Food Category
const deleteCategory= async (categoryToDelete) => {
   // Filter out the category to be deleted
   const updatedCategories = customFoodCategories.filter(
    (category) => category.type !== categoryToDelete.type
  );

  // Update the state with the filtered array of custom food categories
  setCustomFoodCategories(updatedCategories);
};

const saveProfile = async () => {
  
  const {profileNew, isCreated } = await addProfile(user, profile)  
  console.log("profileNew: ", profileNew)
  console.log("isCreated: ", isCreated)
  if (isCreated && profileNew) {
    console.log("SUCCESS to create Profile: ", profileNew)
    setProfiles([profileNew])
    setCurrentProfile(profileNew)
    redirectNow();
  } else { 
    alert("Profile cannot be created")
  }

};

// Deletes Food Category
const updateCategory= async (type, value) => {
  const newWeight = Math.floor(profile?.dailyPortion * value / 100)
  // Create a new array with the updated category
  const updatedCategories = customFoodCategories.map((category) =>
  category.type === type
    ? {
        ...category,
        percentage: value || 0,
        weight: newWeight,
      }
    : category
  );
  // Update the state with the new array
  setCustomFoodCategories(updatedCategories);
  
};

// Save the profile to local storage whenever it changes
useEffect(() => {
  console.log("useEffect ", profile)
}, [profile]);


  return <PageContainer>
    <RegisterForm profile={profile} customFoodCategories={customFoodCategories} setProfile={setProfile} addCategory={addCategory} deleteCategory={deleteCategory} updateCategory={updateCategory} setIsFormCompleated ={setIsFormCompleated}/>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonWithImage
         variant="addButton"
         width='100px'
         as='button'
         imageName="plus_round_fill_white_button.svg"
         imageSize={20}
         onClick={saveProfile}
         disabled = {!isFormCompleated}
        >
         SAVE
      </ButtonWithImage>
    </div>
  </PageContainer>
}

export default Register;