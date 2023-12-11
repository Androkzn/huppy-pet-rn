import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import * as colors from './styles/Colors'
import {Image} from './Image.components'
import {ImageCircle} from './ImageCircle.components'
import Avatar from './Avatar.components'
import { useMediaQuery } from '@mui/material/';
import { ReactComponent as LogoutIcon } from './assets/logout_tab_icon_unselected.svg'
import { ReactComponent as ChangeProfileIcon } from './assets/change_profile.svg'
import { ReactComponent as AddProfileIcon } from './assets/add_profile.svg'
import * as styles  from '../components/styles/NavBar.css'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { user, currentProfile, profiles, isSmallScreen, currentDate, setCurrentDate } = useContext(UserContext);

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
    return (
        <div style={styles.pickerContainerStyle}> 
          <CustomDatePickerWithArrows
            value={currentDate}
            onChange={(date) => setCurrentDate(date) }
            styleContainer= {styles.pickerStyle}
            backgroundColor={colors.white}
          />
        </div>
    );
  };

  return (
    <>
      <AppBar position="fixed"  sx={{ backgroundColor: colors.brown }}>
        <Toolbar>
          {/* Show date picker for mobile instead of logo */}
          {isSmallScreen ? 
          (
            <DatePicker/>
          ) : ( 
            <div>
              <Image imageName="logo_green_stroke.png" width="260" height="77" />
            </div>
          )}

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
  const { logOutUser } = useContext(UserContext);

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  }

  const navLinks = [
    {
      text:  "Profile",
      Icon: () => (
        <Avatar
          width="50px"
          profile={currentProfile}
        />
      ),
      link: '/profile',
    },
    {
      text:  "Add dog",
      Icon: () => (
        <AddProfileIcon  fill={colors.green}/>
      ),
      link: '/register',
    },
    {
      text:  "Change profile",
      Icon: () => (
        <ChangeProfileIcon  fill={colors.green}/>
      ),
      link: '/profile',
    },
    {
      text: 'Logout',
      Icon: () => (
        <LogoutIcon  fill={colors.green}/>
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