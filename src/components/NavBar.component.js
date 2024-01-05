import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, Drawer } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../contexts/data.context';
import * as colors from './styles/Colors';
import { Image } from './Image.components';
import Avatar from './Avatar.components';
import { ImageCircle } from './ImageCircle.components';
import { ReactComponent as ChangeProfileIcon } from './assets/change_profile.svg';
import { ReactComponent as AddProfileIcon } from './assets/add_profile.svg';
import * as styles from '../components/styles/NavBar.css';
import CustomDatePickerWithArrows from '../components/CustomDatePickerWithArrows.component';
import { useUpdateProfile } from '../hooks/query.hooks';

const NavBar = () => {
  const [show, setShow] = useState(false);
  const {
    user,
    currentProfile,
    profiles,
    isSmallScreen,
    currentDate,
    setCurrentDate,
    currentPage,
  } = useContext(DataContext);

  const toggleDrawer = (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setShow((show) => !show);
  };

  const isLoggedIn = () => {
    return user && currentProfile;
  };

  const DatePicker = () => {
    return (
      <div style={styles.pickerContainerStyle}>
        <CustomDatePickerWithArrows
          value={currentDate}
          onChange={(date) => setCurrentDate(date)}
          styleContainer={styles.pickerStyle}
          backgroundColor={colors.white}
        />
      </div>
    );
  };

  const HeaderLogo = () => {
    const isDisplayed =
      !isSmallScreen ||
      currentPage === 'login' ||
      currentPage === 'forgot' ||
      currentPage === 'signup' ||
      currentPage === 'register';
    return (
      <div>
        {isDisplayed && (
          <Image imageName="logo_green_stroke.png" width="220" height="60" />
        )}
      </div>
    );
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: colors.brown }}>
        <Toolbar style={{display: "flex", justifyContent: 'space-between', width: "auto"}}>
          {isSmallScreen && (currentPage === '' || currentPage === 'training') && (
            <DatePicker />
          )}
          <HeaderLogo />
          {isLoggedIn() && (
            <div style={styles.userInfoContainerStyle(isSmallScreen)}>
              {!isSmallScreen && (
                <h2
                  component={Link}
                  onClick={toggleDrawer}
                  style={styles.profileNameStyle}
                >
                  {currentProfile.name}
                </h2>
              )}
              <div  >
                <Avatar
                  width="50px"
                  profile={currentProfile}
                  onClick={toggleDrawer}
                />
              </div>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <TemporaryDrawer
        profiles={profiles}
        currentProfile={currentProfile}
        show={show}
        setShow={setShow}
        toggleDrawer={toggleDrawer}
      />
    </>
  );
};

const TemporaryDrawer = (props) => {
  const { show, toggleDrawer, currentProfile, profiles } = props;
  const { user, setCurrentPage } = useContext(DataContext);
  const navigate = useNavigate();
  const { mutate: updateProfileMutation } = useUpdateProfile();

  const changeCurrentProfileTo = async (profileNew) => {
    const oldProfileId = currentProfile?._id; 
    updateProfileMutation(
      {
        user: user,
        profileId: profileNew._id,
        updateData: {
          isCurrent: true,
        },
      },
    );

    updateProfileMutation({
      user: user,
      profileId: oldProfileId,
      updateData: {
        isCurrent: false,
      },
    });
  };

  const navigateTo = (link) => {
    if (link === 'register' && currentProfile) {
      setCurrentPage('addProfile');
    } else {
      setCurrentPage(link);
    }
    navigate('/' + link);
  };

  const DrawerList = () => (
    <Box
      sx={{ width: 250, height: '100%', backgroundColor: colors.coffe }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {/* // Profile link */}
      <div
        style={styles.linkContainerStyle}
        onClick={() => navigateTo('profile')}
      >
        <div style={styles.linkIconStyle}>
            <Avatar width="50px" profile={currentProfile} />
        </div>
        <div style={styles.linkTitleStyle}> Current Profile </div>
      </div>

      {/* // Add Profile link */}
      <div
        style={styles.linkContainerStyle}
        onClick={() => navigateTo('register')}
      >
        <div style={styles.linkIconStyle}>
          <AddProfileIcon fill={colors.green} />
        </div>
        <div style={styles.linkTitleStyle}> Add Profile </div>
      </div>

      {/* // Change Profile link */}
      {profiles.length > 1 && (
        <div>
          <div style={styles.linkContainerStyle}>
            <div style={styles.linkIconStyle}>
              <ChangeProfileIcon fill={colors.green} />
            </div>
            <div style={styles.linkTitleStyle}> Change Profile </div>
          </div>
          {profiles
            .filter((profile) => !profile.isCurrent)
            .map((profile) => (
              <div
                key={profile._id}
                style={styles.profileLinkContainerStyle}
                onClick={() => changeCurrentProfileTo(profile)}
              >
                <div>
                  <Image
                    imageName={'arrow_right_green.svg'}
                    width="15"
                    height="15"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div style={styles.profileIconStyle}>
                  <Avatar width="30px" profile={profile} />
                </div>
                <div style={styles.profileLinkTitleStyle}>{profile.name}</div>
              </div>
            ))}
        </div>
      )}
    </Box>
  );

  return (
    <div>
      <Drawer open={show} onClose={toggleDrawer}>
        {<DrawerList />}
      </Drawer>
    </div>
  );
};

export default NavBar;
