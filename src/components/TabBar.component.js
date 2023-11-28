import { useContext, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';
import * as colors from './styles/Colors';
import { useMediaQuery } from '@mui/material/';
import { ReactComponent as DiaryIcon } from './assets/diary_tab_icon_unselected.svg'
import { ReactComponent as DashboardIcon } from './assets/dashboard_tab_icon_unselected.svg'
import { ReactComponent as TrainingIcon } from './assets/training_tab_icon_unselected.svg'
import { ReactComponent as HealthIcon } from './assets/health_tab_icon_unselected.svg'
import { ReactComponent as MoreIcon } from './assets/more_tab_icon_unselected.svg'

const TabBar = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:500px)');
  const [value, setValue] = useState(0);
  const fontSize = isSmallScreen ? '11px' : '15px'
  const imageSize = isSmallScreen ? '25px' : '50px'

  const handleChange = (event, newValue) => {
    console.log("newValue",newValue)
    setValue(newValue);
    switch (newValue) {
      case 0: return navigate("/");;
      case 1: return navigate("/dashboard");
      case 2: return navigate("/");
      case 3: return navigate("/");
      case 4: return navigate("/");
  }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
      height:'65px', 
      backgroundColor: colors.brown, 
      display: 'flex', 
      justifyContent: 'space-around', 
      padding: '5px' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        indicatorColor="none"
        sx={{
          
        }}
      >
        <Tab 
          value={0} 
          icon={<DiaryIcon width= {imageSize} fill={value === 0 ? colors.orange : colors.green}/>} 
          label="Diary" 
          sx={{
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
          value={1} 
          icon={<DashboardIcon width= {imageSize} fill={value === 1 ? colors.orange : colors.green}/>} 
          label="Dashboard" 
          sx={{
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
          value={2} 
          icon={<TrainingIcon width= {imageSize} fill={value === 2 ? colors.orange : colors.green}/>} 
          label="Training" 
          sx={{
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
          value={3} 
          icon={ <HealthIcon width= {imageSize} fill={value === 3 ? colors.orange : colors.green}/>} 
          label= "Health"
          sx={{
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
        <Tab 
          value={4} 
          icon={ <MoreIcon width= {imageSize} fill={value === 4 ? colors.orange : colors.green}/>} 
          label="More" 
          sx={{
            minWidth:'15px',
            margin: '0px',
            padding: '10px',
            color: value === 4 ? colors.orange : colors.green,
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
