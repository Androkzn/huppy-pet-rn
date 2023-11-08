import { useContext, useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Add, PieChart, Logout, Home } from '@mui/icons-material/';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import * as colors from './styles/colors'
import {Image} from './Image.components'

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { user, currentProfile, profiles } = useContext(UserContext);

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShow(show => !show);
  };

  return (
    <>
      <AppBar position="static"  sx={{ backgroundColor: colors.brown }}>
        <Toolbar>
          <div>
            <Image imageName="logo_green_stroke.png" width="260" height="77" />
          </div>
          {user && currentProfile && (
            <div style={{ marginLeft: 'auto' }}>
              <Typography variant="h6" component={Link} onClick={toggleDrawer} sx={{ flexGrow: 1, textDecoration: "none", color: colors.green, fontWeight: "bold" }}>
                {currentProfile.name}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <Image imageName="avatar_small_placeholder.png" width="70" height="70" />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <TemporaryDrawer show={show} setShow={setShow} toggleDrawer={toggleDrawer} />
    </>
  );
};

const TemporaryDrawer = (props) => {
  const { show, toggleDrawer } = props;
  const { logOutUser } = useContext(UserContext);

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  }

  const navLinks = [
    {
      text: 'Profile',
      Icon: () => (
        <Image imageName="avatar_small_placeholder.png" width="50" height="50" />
      ),
      link: '/',
    },
    {
      text: 'Diary',
      Icon: () => (
        <Image imageName="diary_tab_icon_unselected.svg" width="50" height="50" />
      ),
      link: '/',
    },
    {
      text: 'Dashboard',
      Icon: () => (
        <Image imageName="dashboard_tab_icon_unselected.svg" width="50" height="50" />
      ),
      link: '/analytics',
    },
    {
      text: 'Training',
      Icon: () => (
        <Image imageName="training_tab_icon_unselected.svg" width="50" height="50" />
      ),
      link: '/newFood',
    },
    {
      text: 'Health & Wellness',
      Icon: () => (
        <Image imageName="health_tab_icon_unselected.svg" width="50" height="50" />
      ),
      link: '/newFood',
    },
    {
      text: 'Logout',
      Icon: () => (
        <Image imageName="logout_tab_icon_unselected.svg" width="50" height="50" />
      ),
      action: logOut,
    },
  ];

  const DrawerList = () => (
    <Box
      sx={{ width: 250, height: "100%",  backgroundColor: colors.coffe }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {
          navLinks.map(({ text, Icon, link, action }) => {
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