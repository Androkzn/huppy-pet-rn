/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import ProfileForm from "../components/ProfileForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFoodCategory, updateProfile, deleteFoodCategory, getAllFoodCategories, updateFoodCategory } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
  const { user, currentProfile } = useContext(UserContext);

  // Function to load state from localStorage
  const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const cachedProfile = loadState('currentProfile', {
    _id : currentProfile?._id,
    name: currentProfile?.name,
    activityType: currentProfile?.activityType,
    avatar: currentProfile?.avatar,
    breed: currentProfile?.breed,
    categories: [currentProfile?.categories],
    dailyPortion: currentProfile?.dailyPortion,
    dailyRatio: currentProfile?.dailyRatio,
    deductCalories: currentProfile?.deductCalories,
    dob: currentProfile?.dob,
    isCurrent: currentProfile?.isCurrent,
    preset: currentProfile?.preset,
    size: currentProfile?.size,
    userId: currentProfile?.userId,
    isRatioSelected: currentProfile?.isRatioSelected,
  })

 // Some prefilled form state
 const [profile, setProfile] = useState(currentProfile || cachedProfile);
 const [customFoodCategories, setCustomFoodCategories] = useState([]);

// Fetch all categories for currentProfile
 const loadFoodCategories = async () => {
  if (profile) {
    const categories = await getAllFoodCategories(user, profile._id); 
    setCustomFoodCategories(categories);
  }
 };

// Updates profile 
const getProfile = () => {
    if (currentProfile){
      setProfile(currentProfile)
      saveState('currentProfile', currentProfile);
      return currentProfile  
    } else {
      setProfile(cachedProfile)
      return  cachedProfile  
  }
}

// Adds new Food Category
const addCategory= async (category) => {
  const isAdded = await addFoodCategory(user, currentProfile, category)  
  if (isAdded) {
    loadFoodCategories()
  }
};

// Deletes Food Category
const deleteCategory= async (categoryToDelete) => {
  const isDeleted = await deleteFoodCategory(user, categoryToDelete._id);
  if (isDeleted) {
    loadFoodCategories()
  }
};

// Deletes Food Category
const updateCategory= async (id, value) => {
  const newWeight = Math.floor(profile?.dailyPortion * value / 100)
  const data = {
    percentage: value || 0,
    weight: newWeight
  }
    
  const isUpdated = await updateFoodCategory(user, id, data);
  if (isUpdated) {
    loadFoodCategories()
  }
};

// Updates specific prooperty for profile
const updateCurrentProfile= async (name, value, dataUpdated) => {
  let data = {
    [name]: value
  }

  if (dataUpdated) { 
    data = dataUpdated
  }
  console.log("updateCurrentProfile name: ", name)
  console.log("updateCurrentProfile value: ", value)
  console.log("updateCurrentProfile dataUpdated: ", dataUpdated)
  console.log("updateCurrentProfile data: ", data)
  const updatedProfile = await updateProfile(user, profile._id, data)  
  if (updatedProfile) {
    console.log("SUCCESS to updateProfile: ", updatedProfile)
    setProfile(updatedProfile);
    saveState('currentProfile', updatedProfile);
  }
};

// Save the profile to local storage whenever it changes
useEffect(() => {
  console.log("useEffect getProfile", currentProfile)
  getProfile()
}, [currentProfile]);

// Loads Food Categories for profile
useEffect(() => {
  console.log("useEffect loadFoodCategories")
  loadFoodCategories()
}, []);

  return <PageContainer>
    <div  style={styles.topButtonsContainerStyle}>
      <ButtonWithImage
          variant="backButton"
          to="/"
          imageName="back_arrow.svg"
          imageSize={20}
        >
         Back
      </ButtonWithImage>
    </div>
    <ProfileForm profile={profile} customFoodCategories={customFoodCategories} updateProfile={updateCurrentProfile} addCategory={addCategory} deleteCategory={deleteCategory} updateCategory={updateCategory}/>
  </PageContainer>
}

export default Profile;