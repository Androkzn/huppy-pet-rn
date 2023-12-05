/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import ProfileForm from "../components/ProfileForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFoodCategory, updateProfile, deleteFoodCategory, getAllFoodCategories, updateFoodCategory } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/Profile.css'
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent } from '@mui/material';
import ChangeAvatarDialog from "../components/ChangeAvatarDialog.component";

const Profile = () => {
  const { user, currentProfile, setCurrentProfile } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL

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
      return <ChangeAvatarDialog avatar={profile.avatar} onSave={saveAvatar} onDelete={deleteAvatar} onClose={closeDialog}/>
    } else if (dialogType === "error") {
      
    } 
  };

  // Handles dialog submission
  const saveAvatar = async () => {
    try {
      // Create an input element to trigger file selection
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const data = new FormData();
          data.append('image', file);
          data.append('name', profile._id);
          data.append('destination', 'avatar');
          const result = await axios.post(`${backendEndpoint}/avatar`, data); 
          await fetchAvatar()
        }
        closeDialog();
      };

      // Trigger the file input click programmatically
      input.click();
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  // Handles dialog submission
  const deleteAvatar = async () => {
    const destination = 'avatar'
    const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);  
    updateCurrentProfile("avatar", "")
    closeDialog();
  };

  //Callback func that opens avatar dialog 
  const updateAvatar = async () => {
    openDialog("avatar")
  };

  // Function to fetch avatar data when component mounts
  const fetchAvatar = async () => {
    try {
      const destination = 'avatar'
      const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);
      updateCurrentProfile("avatar", avatarResult.data)
      return 
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
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
    fetchAvatar()
  }, []);

  return <PageContainer>
    <div  style={styles.backButtonContainerStyle}>
      <ButtonWithImage
          variant="backButton"
          to="/"
          imageName="arrow_left.svg"
          imageSize={20}
          width='100px'
        >
         Back
      </ButtonWithImage>
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