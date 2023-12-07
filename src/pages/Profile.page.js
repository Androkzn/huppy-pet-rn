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
import Compress from 'compress.js';


const Profile = () => {
  const { user, currentProfile, setCurrentProfile } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL
  const key = process.env.REACT_APP_AUTH_KEY_SECRET
  const compress = new Compress();

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

  const compressImage = async (file, { quality = 0.2, type = 'image/jpeg', maxWidth = 1000, maxHeight = 1000 }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Calculate new dimensions while maintaining the aspect ratio
    let newWidth, newHeight;
    if (imageBitmap.width > imageBitmap.height) {
        newWidth = maxWidth;
        newHeight = (maxWidth / imageBitmap.width) * imageBitmap.height;
    } else {
        newHeight = maxHeight;
        newWidth = (maxHeight / imageBitmap.height) * imageBitmap.width;
    }

    // Draw to canvas with new dimensions
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

    // Turn into Blob
    return await new Promise((resolve) =>
        canvas.toBlob(resolve, type, quality)
    );
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
        try {
          const compressedFile = await compressImage(file, {
            type: 'image/jpeg',
        });
          // Create a new FormData object
          const data = new FormData();
          // Append the compressed file as a Blob
          data.append('image', compressedFile);
          // Append other form data fields
          data.append('name', profile._id);
          data.append('destination', 'avatar');
          // Use Axios to send the FormData to the server
          const result = await axios.post(`${backendEndpoint}/avatar/${profile._id}`, data);
          await fetchAvatar();
        } catch (error) {
          console.log('Error uploading file:', error);
        }
      }
      closeDialog();
    };

    // Trigger the file input click programmatically
    input.click();
  } catch (error) {
    console.log('Error selecting file:', error);
  }
};

  
    // Handles dialog submission
    const deleteAvatar = async () => {
      const destination = 'avatar'
      // const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`);  
      try {
        const avatarResult = await axios.delete(`${backendEndpoint}/avatar/${profile?._id}?destination=${destination}`); 
        updateCurrentProfile("avatar", "")
        closeDialog();
      } catch (error) {
        console.log("Error deleting avatar:", error);
      }
    };
  
    //Callback func that opens avatar dialog 
    const updateAvatar = async () => {
      openDialog("avatar")
    };
  
    // Function to fetch avatar data when component mounts
    const fetchAvatar = async () => {
      console.log(`Fetch Avatar for`, profile)
      try {
        const avatarResult = await axios.get(`${backendEndpoint}/avatar/${profile?._id} `);
        const url = avatarResult.data
        console.log(`avatar url`, url)
        updateCurrentProfile("avatar", url)
        return 
      } catch (error) {
        console.log("Error fetching avatar:", error);
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