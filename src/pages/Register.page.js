/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import RegisterForm from "../components/RegisterForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFoodCategory, updateProfile, deleteFoodCategory, getAllFoodCategories, updateFoodCategory } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

const Register = () => {
  const { user } = useContext(UserContext);

  // Function to load state from localStorage
  const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [customFoodCategories, setCustomFoodCategories] = useState([]);

  let newProfile = {
    _id : "",
    name: "",
    activityType: "active",
    avatar: "",
    breed: "",
    categories: [customFoodCategories],
    dailyPortion: 250,
    dailyRatio: 5,
    weight: 10,
    deductCalories: false,
    dob: (new Date()).toISOString(),
    isCurrent: true,
    preset: "barfAdult",
    size: "small",
    userId: user.id,
    isRatioSelected: false,
    weightDog: 10,
  }

  let categories = []

  // Some prefilled form state
  const [profile, setProfile] = useState(newProfile);

// Adds new Food Category
const addCategory= async (category) => {
  
};

// Deletes Food Category
const deleteCategory= async (categoryToDelete) => {
  
};

const saveProfile = async () => {

}

// Deletes Food Category
const updateCategory= async (id, value) => {
  const newWeight = Math.floor(profile?.dailyPortion * value / 100)
  const data = {
    percentage: value || 0,
    weight: newWeight
  }
    
  
};

// Save the profile to local storage whenever it changes
useEffect(() => {
  console.log("useEffect ", profile)
}, [profile]);


  return <PageContainer>
    <RegisterForm profile={profile} customFoodCategories={customFoodCategories} setProfile={setProfile} addCategory={addCategory} deleteCategory={deleteCategory} updateCategory={updateCategory}/>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonWithImage
         variant="addButton"
         width='100px'
         as='button'
         imageName="plus_round_fill_white_button.svg"
         imageSize={20}
         onClick={saveProfile}
        >
         SAVE
      </ButtonWithImage>
    </div>
  </PageContainer>
}

export default Register;