/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import ProfileForm from "../components/ProfileForm.component";
import {ButtonImage, ButtonLink} from '../components/Buttons.components'
import { addFoodCategory, updateProfile, deleteFoodCategory, getAllFoodCategories, updateFoodCategory } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/Profile.css'
import { Dialog, DialogContent } from '@mui/material';
import ChangeAvatarDialog from "../components/ChangeAvatarDialog.component";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, currentProfile, setCurrentPage, setCurrentProfile } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
 
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
    if (dialogType === "avatar") { 
      return <ChangeAvatarDialog  updateCurrentProfile={updateCurrentProfile} profile={profile}  onClose={closeDialog}/>
    } else if (dialogType === "error") {
      
    } 
  };

  const navigateBack = () => {
    setCurrentPage("home")
    navigate("/")
  }

  //Callback func that opens avatar dialog 
  const updateAvatar = async () => {
    openDialog("avatar")
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
    weight: currentProfile?.weight
  })

  // Some prefilled form state
  const [profile, setProfile] = useState(currentProfile || cachedProfile);
  const [customFoodCategories, setCustomFoodCategories] = useState([]);

  // Updates profile 
  const getProfile = async () => {
      if (currentProfile){
        setProfile(currentProfile)
        saveState('currentProfile', currentProfile);
        return currentProfile  
      } else {
        setProfile(cachedProfile)
        return  cachedProfile  
    }
  }

  // Fetch all categories for currentProfile
  const loadFoodCategories = async () => {
    if (profile) {
      const categories = await getAllFoodCategories(user, profile._id); 
      setCustomFoodCategories(categories);
    }
  };

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
    console.log("updateCurrentProfile: ", data)
    const updatedProfile = await updateProfile(user, profile._id, data)  
    if (updatedProfile) {
      console.log("SUCCESS to updateProfile: ", updatedProfile)
      setProfile(updatedProfile);
      setCurrentProfile(updatedProfile);
      saveState('currentProfile', updatedProfile);
    }
  };

  // Save the profile to local storage whenever it changes
  useEffect(() => {
    getProfile()
  }, [currentProfile]);

  // Loads Food Categories for profile
  useEffect(() => {
    loadFoodCategories()
  }, []);

  return <PageContainer>
    <div style={styles.fixedTopContainer}>
    <div  style={styles.backButtonContainerStyle}>
      <ButtonImage
          variant="backButton"
          onClick={navigateBack}
          imageName="arrow_left_green.svg"
          imageSize={20}
        >
         Back
      </ButtonImage>
      <div  css={styles.profileTitleStyle}>{"Profile"}</div>
      <div style={{width: '100px'}}></div>
    </div>
    </div>
    <ProfileForm 
      profile={profile} 
      customFoodCategories={customFoodCategories} 
      updateProfile={updateCurrentProfile} 
      addCategory={addCategory} 
      deleteCategory={deleteCategory} 
      updateCategory={updateCategory}
      updateAvatar={updateAvatar}
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

export default Profile;