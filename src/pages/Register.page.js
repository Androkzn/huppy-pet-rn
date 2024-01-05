/** @jsxImportSource @emotion/react */

import { useContext, useState } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import RegisterForm from '../components/RegisterForm.component';
import { ButtonImage } from '../components/Buttons.components';
import * as styles from '../components/styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog, DialogContent } from '@mui/material';
import AddAvatarDialog from '../components/AddAvatarDialog.component';
import { useAddProfile, useAddFoodCategory } from '../hooks/query.hooks';

const Register = () => {
  const navigate = useNavigate();
  const { user, setCurrentPage, currentProfile, profiles, logOutUser } = useContext(DataContext);
  const [isFormCompleated, setIsFormCompleated] = useState(false);
  const [customFoodCategories, setCustomFoodCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('addActivity');
  const [avatar, setAvatar] = useState(null);
  const backendEndpoint = process.env.REACT_APP_BACKEND_URL;
  const { mutate: addProfileMutation } = useAddProfile();
  const { mutate: addFoodCategoryMutation } = useAddFoodCategory();
  
  const newProfile = {
    _id: '',
    name: '',
    activityType: 'active',
    avatar: '',
    breed: '',
    categories: [customFoodCategories],
    dailyPortion: 250,
    dailyRatio: 5,
    weight: 5,
    deductCalories: false,
    dob: new Date().toISOString(),
    isCurrent: !(profiles && profiles.length > 0),
    preset: 'barfAdult',
    size: 'small',
    userId: user?.id || '',
    isRatioSelected: false,
  };

  // Some prefilled form state
  const [profile, setProfile] = useState(newProfile);

  // Opens dialog
  const openDialog = (dialogTypeNew) => {
    setDialogType(dialogTypeNew);
    setDialogOpen(true);
  };

  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    if (dialogType === 'avatar') {
      return (
        <AddAvatarDialog
          avatar={avatar ? URL.createObjectURL(avatar) : null}
          onSave={saveAvatar}
          onDelete={deleteAvatar}
          onClose={closeDialog}
        />
      );
    } else if (dialogType === 'error') {
    }
  };

  // Handles dialog submission
  const saveAvatar = async (avatar) => {
    setAvatar(avatar);
    setProfile({ ...profile, 'avatar': new Date().toISOString() });
    closeDialog();
  };

  // Handles dialog submission
  const uploadAvatar = async (profileId) => {
    if (avatar) {
      const data = new FormData();
      data.append('image', avatar);
      data.append('name', profileId);
      data.append('destination', 'avatar');
      await axios.post(`${backendEndpoint}/api/avatar`, data);
    }
  };



  // Handles dialog submission
  const deleteAvatar = async () => {
    setProfile({ ...profile, 'avatar': '' });
    setAvatar(null);
    closeDialog();
  };

  //Callback func that opens avatar dialog
  const updateAvatar = async () => {
    openDialog('avatar');
  };

  const navigateTo = async () => {
    // If a user logged in and alredy created profile =>  navigate to home page
    if (currentProfile) {
      setCurrentPage('');
      navigate('/');
    } else {
      const registrationCredentials = JSON.parse(localStorage.getItem('registrationCredentials'))
      // If a user logged during registration but profile is not created =>  navigate to signup page
      if (registrationCredentials, registrationCredentials.email !== '', registrationCredentials.password !== '') {
        setCurrentPage('signup');
        navigate('/signup');
      // If a succesfully user logged in but profile is not created during registration=>  navigate to signup page
      } else { 
        await logOutUser()  
        setCurrentPage('login');
        navigate('/login');
      }
    }
  };

  // Adds new Food Category
  const addCategory = async (category) => {
    // Create a new array by copying the existing customFoodCategories and adding the new category
    const updatedCategories = [...customFoodCategories, category];
    // Update the state with the new array of custom food categories
    setCustomFoodCategories(updatedCategories);
  };

  // Deletes Food Category
  const deleteCategory = async (categoryToDelete) => {
    // Filter out the category to be deleted
    const updatedCategories = customFoodCategories.filter(
      (category) => category.type !== categoryToDelete.type
    );

    // Update the state with the filtered array of custom food categories
    setCustomFoodCategories(updatedCategories);
  };

  const saveProfile = async () => {
    addProfileMutation(
      {
        user: user,
        profile: profile,
      },
      {
        onSuccess: (data) => {
          const profileNew = data;

          // Upload avatar to AWS S3
          uploadAvatar(profileNew?._id);

          // Add food categories from customFoodCategories array if preset is custom
          if (profileNew?.preset === 'custom') {
            for (const category of customFoodCategories) {
              addFoodCategoryMutation({
                user: user,
                currentProfile: profileNew,
                data: category,
              });
            }
          }
    
          //Clear temporarly saved credentials from local storage
          localStorage.removeItem('registrationCredentials'); 
          setCurrentPage('home');
          navigate('/');
         
        },
      }
    );
  };

  // Deletes Food Category
  const updateCategory = async (type, value) => {
    const newWeight = Math.floor((profile?.dailyPortion * value) / 100);
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

  return (
    <PageContainer>
      <div style={styles.fixedTopContainer}>
        <div style={styles.backButtonContainerStyle}>
          {/* Show back button if profile created for existing user */}
          <ButtonImage
            variant="backButton"
            onClick={navigateTo}
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonImage>
          <div css={styles.profileTitleStyle}>{'Create Profile'}</div>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      <RegisterForm
        profile={profile}
        avatar={avatar}
        customFoodCategories={customFoodCategories}
        setProfile={setProfile}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        updateCategory={updateCategory}
        setIsFormCompleated={setIsFormCompleated}
        updateAvatar={updateAvatar}
      />
      <div style={styles.saveButtonContainerStyle}>
        <ButtonImage
          variant="addButton"
          width="100px"
          imageName="plus_round_fill_white_button.svg"
          imageSize={20}
          onClick={saveProfile}
          disabled={!isFormCompleated}
        >
          SAVE
        </ButtonImage>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogContent>{getDialogContent()}</DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default Register;
