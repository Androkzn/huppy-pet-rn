/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import ProfileForm from "../components/ProfileForm.component";
import {ButtonWithImage} from '../components/Buttons.components'
import { addFoodTemplate } from "../graphql/graphqlUtils";
import * as styles  from '../components/styles/CreateNewFood.css'
import { useNavigate, useLocation } from "react-router-dom";

// Function to load state from localStorage
const loadState = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Function to save state to localStorage
const saveState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const Profile = () => {
  const { user, currentProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
 

// Some prefilled form state
const getProfile = () => {
  
  console.log("currentProfile getProfile", currentProfile)
    if (currentProfile !==null)   {
      return currentProfile  
    } else {
      loadState('currentProfile', {
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
        weight: currentProfile?.weight,
    })
  }
}

// Some prefilled form state
const [profile, setProfile] = useState(getProfile());


// Save the profile to local storage whenever it changes
useEffect(() => {
  saveState('currentProfile', profile);
}, [profile]);


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
    <ProfileForm profile={profile} setProfile={setProfile} />
  </PageContainer>
}

export default Profile;