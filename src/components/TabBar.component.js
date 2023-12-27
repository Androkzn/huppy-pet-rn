import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../contexts/data.context';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as colors from './styles/Colors';
import { ReactComponent as DiaryIcon } from './assets/diary_tab_icon_unselected.svg'
import { ReactComponent as DashboardIcon } from './assets/dashboard_tab_icon_unselected.svg'
import { ReactComponent as TrainingIcon } from './assets/training_tab_icon_unselected.svg'
import { ReactComponent as MoreIcon } from './assets/more_tab_icon_unselected.svg'

const TabBar = () => {
  const {user, currentProfile, isSmallScreen, currentPage, setCurrentPage} = useContext(DataContext);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const fontSize = isSmallScreen ? '11px' : '15px'
  const imageSize = isSmallScreen ? '25px' : '50px'

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0: 
      setCurrentPage("")
      return navigate("/");;
      case 1: 
      setCurrentPage("dashboard")
      return navigate("/dashboard");
      case 2: 
      setCurrentPage("training")
      return navigate("/training");
      case 3: 
      setCurrentPage("more")
      return navigate("/more");
    }
  };

  const handleClick = (event) => {
    const id = parseInt(event.target.id, 10);
    setValue(id);
    switch (id) {
      case 0: 
      setCurrentPage("")
      return navigate("/");;
      case 1: 
      setCurrentPage("dashboard")
      return navigate("/dashboard");
      case 2: 
      setCurrentPage("training")
      return navigate("/training");
      case 3: 
      setCurrentPage("more")
      return navigate("/more");
    }
  };

  const handleSetCurrentPage= () => {
    switch (currentPage) {
      case "": 
      return  setValue(0);
      case "dashboard": 
      return  setValue(1);
      case "training": 
      return  setValue(2);
      case "more": 
      return  setValue(3);
    }
  }

  useEffect(() => {
    // Function to fetch avatar data when component mounts
    handleSetCurrentPage()  
 }, [currentPage]);


  const isLoggedIn = () => {
    return user && currentProfile
  }

  if (!isLoggedIn()) {
    // If the user is not logged in, don't render the TabBar
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
      height:'65px', 
      backgroundColor: colors.brown, 
      display: 'flex', 
      justifyContent: 'space-around', 
      padding: '5px',
      boxShadow: '0px -3px 10px rgba(0, 0, 0, 0.1)',  
      
      }}>
      <Tabs
        value={value}
        onChange={handleChange}
        onClick={handleClick}
        aria-label="icon label tabs example"
        indicatorColor="none"
        sx={{}}
      >
        <Tab
          id={0}
          value={0} 
          icon={
           <DiaryIcon width= {imageSize} fill={value === 0 ? colors.orange : colors.green}/>
        } 
          label="Diary" 
          sx={{
            fontFamily: "'Balsamiq Sans', sans-serif",
            minWidth:'15px',
            margin: '0px',
            padding: '10px',
            color: value === 0 ? colors.orange : colors.green,
            fontSize: {fontSize},
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          id={1}
          value={1} 
          icon={
          <DashboardIcon width= {imageSize} fill={value === 1 ? colors.orange : colors.green}/>
        } 
          label="Dashboard" 
          sx={{
            fontFamily: "'Balsamiq Sans', sans-serif",
            minWidth:'15px',
            margin: '0px',
            padding: '10px',
            color: value === 1 ? colors.orange : colors.green,
            fontSize: {fontSize},
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          id={2}
          value={2} 
          icon={<TrainingIcon width= {imageSize} fill={value === 2 ? colors.orange : colors.green}/>} 
          label="Training" 
          sx={{
            fontFamily: "'Balsamiq Sans', sans-serif",
            minWidth:'15px',
            margin: '0px',
            padding: '10px',
            color: value === 2 ? colors.orange : colors.green,
            fontSize: {fontSize},
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          id={3}
          value={3} 
          icon={ <MoreIcon width= {imageSize} fill={value === 3 ? colors.orange : colors.green}/>} 
          label="More" 
          sx={{
            fontFamily: "'Balsamiq Sans', sans-serif",
            minWidth:'15px',
            margin: '0px',
            padding: '10px',
            color: value === 3 ? colors.orange : colors.green,
            fontSize: {fontSize},
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
      </Tabs>
    </div>
  );
};

export default TabBar;
