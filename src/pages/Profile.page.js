/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import ProfileForm from '../components/ProfileForm.component';
import { ButtonImage } from '../components/Buttons.components';
import {
  useAddFoodCategory,
  useDeleteFoodCategory,
  useUpdateFoodCategory,
  useUpdateProfile,
} from '../hooks/query.hooks';
import * as styles from '../components/styles/Profile.css';
import { Dialog, DialogContent } from '@mui/material';
import ChangeAvatarDialog from '../components/ChangeAvatarDialog.component';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, currentProfile, setCurrentPage } = useContext(DataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('addActivity');

  const { mutate: addFoodCategoryMutation } = useAddFoodCategory();
  const { mutate: deleteFoodCategoryMutation } = useDeleteFoodCategory();
  const { mutate: updateFoodCategoryMutation } = useUpdateFoodCategory();
  const { mutate: updateProfileMutation } = useUpdateProfile();

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
        <ChangeAvatarDialog
          updateCurrentProfile={updateCurrentProfile}
          profile={profile}
          onClose={closeDialog}
        />
      );
    } else if (dialogType === 'error') {
    }
  };

  //Callback func that opens avatar dialog
  const updateAvatar = async () => {
    openDialog('avatar');
  };

  const cachedProfile = loadState('currentProfile', {
    _id: currentProfile?._id,
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
    weight: currentProfile?.weight,
  });

  // Some prefilled form state
  const [profile, setProfile] = useState(currentProfile || cachedProfile);

  // Updates profile
  const getProfile = async () => {
    if (currentProfile) {
      setProfile(currentProfile);
      saveState('currentProfile', currentProfile);
      return currentProfile;
    } else {
      setProfile(cachedProfile);
      return cachedProfile;
    }
  };

  // Adds new Food Category
  const addCategory = async (category) => {
    addFoodCategoryMutation({
      user: user,
      currentProfile: currentProfile,
      data: category,
    });
  };

  // Deletes Food Category
  const deleteCategory = async (categoryToDelete) => {
    deleteFoodCategoryMutation({
      user: user,
      _id: categoryToDelete._id,
    });
  };

  // Updates Food Category
  const updateCategory = async (id, value) => {
    const newWeight = Math.floor((profile?.dailyPortion * value) / 100);
    const data = {
      percentage: value || 0,
      weight: newWeight,
    };

    updateFoodCategoryMutation({
      user: user,
      categoryId: id,
      updateData: data,
    });
  };

  // Updates specific prooperty for profile
  const updateCurrentProfile = async (name, value, dataUpdated) => {
    let data = {
      [name]: value,
    };

    if (dataUpdated) {
      data = dataUpdated;
    }

    updateProfileMutation(
      {
        user: user,
        profileId: profile._id,
        updateData: data,
      },
      {
        onSuccess: (data) => {
          const updatedProfile = data;
          setProfile(updatedProfile);
          saveState('currentProfile', updatedProfile);
        },
      }
    );
  };

  // Save the profile to local storage whenever it changes
  useEffect(() => {
    getProfile();
  }, [currentProfile]);

  const navigateTo = async () => {
    setCurrentPage('');
    navigate('/');
  };

  return (
    <PageContainer>
      <div style={styles.fixedTopContainer}>
        <div style={styles.backButtonContainerStyle}>
          <ButtonImage
            variant="backButton"
            onClick={navigateTo}
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonImage>
          <div css={styles.profileTitleStyle}>{'Profile'}</div>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      <ProfileForm
        updateProfile={updateCurrentProfile}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        updateCategory={updateCategory}
        updateAvatar={updateAvatar}
      />

      {/* Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogContent>{getDialogContent()}</DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default Profile;
