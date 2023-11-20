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
  const { user, currentProfile, profiles } = useContext(UserContext);

  const handleChange = (event, newValue) => {
    console.log("newValue",newValue)
    setValue(newValue);
    switch (newValue) {
      case 0: return navigate("/");;
      case 1: return navigate("/");
      case 2: return navigate("/");
      case 3: return navigate("/");
      case 4: return navigate("/");
  }
  };

  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%', height:'65px', backgroundColor: colors.brown, display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        indicatorColor="none"
      >
        <Tab 
          value={0} 
          icon={<DiaryIcon fill={value === 0 ? colors.orange : colors.green}/>} 
          label="Diary" 
          sx={{
            color: value === 0 ? colors.orange : colors.green,
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          value={1} 
          icon={<DashboardIcon fill={value === 1 ? colors.orange : colors.green}/>} 
          label="Dashboard" 
          sx={{
            color: value === 1 ? colors.orange : colors.green,
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          value={2} 
          icon={<TrainingIcon fill={value === 2 ? colors.orange : colors.green}/>} 
          label="Training" 
          sx={{
            color: value === 2 ? colors.orange : colors.green,
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          value={3} 
          icon={ <HealthIcon fill={value === 3 ? colors.orange : colors.green}/>} 
          label="Health & Wellness" 
          sx={{
            color: value === 3 ? colors.orange : colors.green,
            '&.Mui-selected': {
              color: colors.orange,
              fontWeight: 'bold',
              borderBottom: `3px solid ${colors.orange}`,
            },
          }}
        />
        <Tab 
          value={4} 
          icon={ <MoreIcon fill={value === 4 ? colors.orange : colors.green}/>} 
          label="More" 
          sx={{
            color: value === 4 ? colors.orange : colors.green,
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
