import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from '../contexts/user.context';
import * as colors from './styles/Colors'
import {Image} from './Image.components'
import Avatar from './Avatar.components'
import { ReactComponent as LogoutIcon } from './assets/logout_tab_icon_unselected.svg'
import { ReactComponent as ChangeProfileIcon } from './assets/change_profile.svg'
import { ReactComponent as AddProfileIcon } from './assets/add_profile.svg'
import * as styles  from '../components/styles/NavBar.css'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { user, currentProfile, profiles, isSmallScreen, currentDate, setCurrentDate, currentPage } = useContext(UserContext);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShow(show => !show);
  };

  const isLoggedIn = () => {
    return user && currentProfile
  }

  const DatePicker = () => {
    console.log("NavBar currentPage", currentPage)
    return (
        <div>
        { isSmallScreen && (currentPage === "home" || currentPage === "training") && <div style={styles.pickerContainerStyle}> 
          <CustomDatePickerWithArrows
            value={currentDate}
            onChange={(date) => setCurrentDate(date) }
            styleContainer= {styles.pickerStyle}
            backgroundColor={colors.white}
          />
        </div>
        }
        </div>
    );
  };

  const HeaderLogo = () => {
    const isDisplayed =  (!isSmallScreen) ||  ((currentPage === "login" || currentPage === "forgot" || currentPage === "signup" || currentPage === "register"))
    return (
      <div>
         { isDisplayed && 
          <Image imageName="logo_green_stroke.png" width="260" height="77" />
         }
    </div>
    );
  };
 
  return (
    <>
      <AppBar position="fixed"  sx={{ backgroundColor: colors.brown}}>
        <Toolbar>
          <DatePicker/>
          <HeaderLogo/>
          {isLoggedIn() && (
            <div style={styles.userInfoContainerStyle(isSmallScreen)}>
               {!isSmallScreen && (
                <h2  component={Link} onClick={toggleDrawer} style={ styles.profileNameStyle}>
                  {currentProfile.name}
                </h2>
               )}
              <Avatar
                width="50px"
                profile={currentProfile}
                onClick={toggleDrawer}
              />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <TemporaryDrawer profiles={profiles} currentProfile={currentProfile} show={show} setShow={setShow} toggleDrawer={toggleDrawer} />
    </>
  );
};

const TemporaryDrawer = (props) => {
  const { show, toggleDrawer, currentProfile, profiles } = props;
  const { logOutUser, setCurrentPage } = useContext(UserContext);
  const navigate = useNavigate();

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  };

  const navigateTo = (link) => {
    setCurrentPage(link);
    navigate("/" + link);
  };

  const navLinks = [
    {
      text: "Profile",
      Icon: () => (
        <Avatar width="50px" profile={currentProfile} />
      ),
      action: () => navigateTo('profile'),
    },
    {
      text: "Add dog",
      Icon: () => (
        <AddProfileIcon fill={colors.green} />
      ),
      action: () => navigateTo('register'),
    },
    {
      text: "Change profile",
      Icon: () => (
        <ChangeProfileIcon fill={colors.green} />
      ),
      action: () => navigateTo('profile'),  
    },
    {
      text: 'Logout',
      Icon: () => (
        <LogoutIcon fill={colors.green} />
      ),
      action: logOut,
    },
  ];

  // Filter out the "Change profile" item if the number of profiles is less than 2
  const filteredNavLinks = profiles.length < 2
    ? navLinks.filter(({ text }) => text !== "Change profile")
    : navLinks;

  const DrawerList = () => (
    <Box
      sx={{ width: 250, height: "100%",  backgroundColor: colors.coffe }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {
          filteredNavLinks.map(({ text, Icon, link, action }) => {
            return link ?
              <Link to={link} style={{ textDecoration: "none", color: "inherit" }} key={text}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
              :
              <ListItem button onClick={action} key={text}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
          })
        }
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={show}
        onClose={toggleDrawer}
      >
        {<DrawerList />}
      </Drawer>
    </div>
  );
}

export default NavBar;