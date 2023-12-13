/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import MealCard from '../components/MealCard.component';
import * as styles  from '../components/styles/Home.css'
import * as colors from '../components/styles/Colors';
import {Image} from '../components/Image.components'
import { ReactComponent as DiaryIcon } from '../components/assets/diary_tab_icon_unselected.svg'
import { ReactComponent as ActivityIcon } from '../components/assets/activity_tab_icon_unselected.svg'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { loadMeals, loadFood, loadActivities, loadTrainings, addMeal, addActivity, addTraining, getAllFoodCategories} from "../graphql/graphqlUtils";
import ActivityCard from '../components/ActivityCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewActivityForm from "../components/NewActivityForm.component";
import NewTrainingForm from "../components/NewTrainingForm.component";
import * as Enums from "../helpers/Enums.helper"
import ChartPie from '../components/ChartPie.components'
import {FoodCategoryRow, ToggleStatisticSection, CaloriesStatisticSection, CategoriesStatisticSection } from "../components/Statistic.components"
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from "../helpers/Constants.helper"
import {ButtonText} from "../components/Buttons.components"

const Home = () => {
    // Function to load state from localStorage
    const loadState = (key, defaultValue) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    };
  
    // Function to save state to localStorage
    const saveState = (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    };

  const {user, currentProfile, currentDate, setCurrentDate} = useContext(UserContext);
  const [meals, setMeals] = useState([]);
  const [food, setFood] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const [isStatisticToday, setStatisticToday] = useState(true);

  // Opens dialog 
  const openDialog = (dialogTypeNew) => {
    console.log("openDialog", dialogTypeNew)
    setDialogType(dialogTypeNew)
    setDialogOpen(true);
  };
  
  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Handles dialog submission
  const handleDialogSubmit = (form, dialogType) => {
    if (dialogType === "addActivity") {
      const data = {
        "type": form.type,
        "metric": form.metric,
        "distance": form.distance,
        "duration": form.duration,
        "burnedCalories": form.burnedCalories,
      }

      addActivityForDate(data)
    } 
      
    closeDialog();
  };
 
  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    console.log("getDialogContent", dialogType)
    if (dialogType === "addActivity") { 
      return <NewActivityForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } else if (dialogType === "addTraining") {
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } 
  };

  // Updates the Meals  from the response. 
  const loadMealsForDate = async () => {
    if (currentProfile) {
      const mealsNew = await loadMeals(user, currentProfile, currentDate); 
      setMeals(mealsNew);
      // Adds empty meal for date 
      if (mealsNew == null || mealsNew.length === 0) {
        addMealForDate()
      }
        
    }
  };

  
  // Updates the Food from the response. 
  const loadFoodForDate = async () => {
    if (currentProfile) {
      const foodUpdated = await loadFood(user, currentProfile, currentDate, isStatisticToday); 
      setFood(foodUpdated);
    }
  };


  // Updates the Activities from the response. 
  const loadActivitiesForDate = async () => {
    if (currentProfile) {
      const activities = await loadActivities(user, currentProfile, currentDate); 
      setActivities(activities);
    }
  };

  // Fetch all Food categories for currentProfile
 const loadFoodCategories = async () => {
    if (currentProfile) {
      if ( currentProfile?.preset !== Enums.RatioPresets.CUSTOM) {
        const allCategoriesForPresset = Enums.getCategoriesForRatioPreset(currentProfile?.dailyPortion, currentProfile?._id,  currentProfile?.preset) 
        setCategories(allCategoriesForPresset)
        const data = (allCategoriesForPresset).map((category) => ({
          name: category.name,
          weight: category.weight,
          percentage: category.percentage,
          color: category.color,
        }));
        setCategoriesData(data)
      } else {
        const categories = await getAllFoodCategories(user, currentProfile._id); 
        setCategories(categories)
        const data = (categories).map((category) => ({
          name: category.name,
          weight: category.weight,
          percentage: category.percentage,
          color: category.color,
        }));
        setCategoriesData(data)
      }
    }
 };

  // Function is responsible for creating a new meal
  const addMealForDate = async () => {
    const isAdded = await addMeal(user, currentProfile, currentDate)  
    if (isAdded) {
      updateMeals();
    }
  };

  // Function is responsible for creating a new activity
  const addActivityForDate = async (data) => {
    const isAdded = await addActivity(user, currentProfile, currentDate, data)  
    if (isAdded) {
      updateActivities();
    }
  };

  // Responsible for fetching data for  meals/traings/activities/food when data is changed
  useEffect(() => {
    updateAll()
    if (currentDate === null || currentDate === undefined) {
      setCurrentDate( new Date())
      saveState('currentDate',  new Date());
    } else {    
      saveState('currentDate', currentDate);
    }
  }, [currentDate, currentProfile]);

  // Helper function to be performed after an meals/traing/activity/food has been changed.
  const updateAll = () => {
    updateMeals()
    updateActivities()
    updateCategories()
    updateFood()
  }

  const updateCategories= () => {
    loadFoodCategories();
  }

  const updateMeals = async  () => {
    await loadMealsForDate();
  }

  const updateFood = () => {
    loadFoodForDate();
  }

  const updateActivities = () => {
    loadActivitiesForDate();
  }

  function getTotalCategoryWeight (category) {
    return Math.floor(currentProfile?.dailyPortion * category?.percentage / 100)
  }

  const DatePicker = () => {
    return (
        <div style={styles.pickerContainerStyle}> 
          <CustomDatePickerWithArrows
            label="Select date:"
            value={currentDate}
            onChange={(date) => setCurrentDate(date) }
            stylePicker={styles.pickerStyle}
          />
        </div>
    );
  };
  
  const Statistic = ({ foodData }) => {
    const [isStatisticExpanded, setStatisticExpanded] = useState(false);

    

    return (
      <div style={styles.childConteinerStyle}> 
      <div style={styles.headerStyle}  onClick={() => {isSmallScreen ? setStatisticExpanded(!isStatisticExpanded) : setStatisticExpanded(isStatisticExpanded)}}>
        <div style={styles.headerTiteStyle}>
          
          <div style={styles.headerArrowStyle} >
            <Image 
              imageName= {isStatisticExpanded ? "arrow_down_green.svg" : "arrow_right_green.svg"}
              width="20" 
              height="20" 
            />
          </div>
          <div style={styles.headerTextStyle}>
            <div style={styles.headingStyle}>STATS</div>
            <div style={styles.headingStyle}>
            {isStatisticToday ? 'Today / Goal' : 'This week / Goal'}
            </div>
          </div>
        </div>
      </div>
        <div style={styles.statisticContainerStyle}>
          <CaloriesStatisticSection
            foodData={foodData}
            categories={categories}
            activities={activities}
            currentProfile={currentProfile}
            isStatisticToday={isStatisticToday}
            currentDate={currentDate}
           />
           { isStatisticExpanded && (
            <div>
              {categories.map(category => (
                <CategoriesStatisticSection
                key={category.name}
                  category={category}  
                  categories= {categories}
                  currentProfile={currentProfile}
                  foodData={foodData}
                  isStatisticToday={isStatisticToday}
                  currentDate={currentDate}
                />
              ))}
            </div>
         )}
          <ToggleStatisticSection 
            initialValue={!isStatisticToday}
            onChange ={() => {
              setStatisticToday(!isStatisticToday)
            }}
          />
        </div>
      </div> 
    );
  };

  const Chart = ({categories}) => {
    return (
      <div style={styles.childConteinerStyle}> 
        <div style={styles.headerStyle}>
          <div style={styles.headerTextStyle}>
            <h3 style={styles.headingStyle}>DIET BALANCE</h3>
          </div>
        </div>
        <div style={styles.chartContainerStyle}>
          {/* Chart */}
          <div style={styles.chartStyle}>
              <ChartPie data={categories}/>
          </div>
          <div style={styles.chartLegentStyle}>
              {categories.map((category)  => (
                <FoodCategoryRow
                  key={category?.name}
                  name={category?.name}
                  weight={getTotalCategoryWeight(category)}
                  color={category?.color}
                  value={category?.percentage} 
                />
              ))}
          </div>
        </div>
      </div>
    );
  };

  const Meals = ({ mealsData }) => {
    return (
      <div >  {/* Meal container*/}
        {  
          mealsData.map((meal, index) => 
          <div key={meal._id}>
            <MealCard meal={meal} index={index + 1} updateMeals={updateMeals} updateFoods={updateFood} mealsCount = {mealsData.length}/>
          </div>)
        }
      </div>  
    );
  };
  
  const Activities = ({activitiesData}) => {
    const [isActivitiesExpanded, setActivitiesExpanded] = useState(true);

    return (
      <div style={styles.childConteinerStyle}> {/* Activities container*/}        
        <div style={styles.headerStyle}>{/* Header container*/}
          <div style={styles.headerTiteStyle} onClick={() => {isSmallScreen ? setActivitiesExpanded(!isActivitiesExpanded) : setActivitiesExpanded(isActivitiesExpanded)}}> 
          <div style={styles.headerArrowStyle} >
            <Image 
              imageName= {isActivitiesExpanded ? "arrow_down_green.svg" : "arrow_right_green.svg"}
              width="20" 
              height="20" 
            />
          </div>
            <div style={styles.headingStyle}>ACTIVITIES</div>
          </div>
          <button
            style={styles.headerAddButtonStyle}
            onClick={() => {
              if (isActivitiesExpanded) { 
                openDialog("addActivity");
              } else {
                setActivitiesExpanded(!isActivitiesExpanded)
              }
            }}
          >  
           <Image imageName="plus_round_fill_button.svg" width="30" height="30" />
          </button>
        </div>{/* Header container*/}
        <div  style={styles.columnStyle}>{/* Activity container*/}
          {/* Show activity cards if data avaliable, if not -> show placeholder*/}
          { isActivitiesExpanded && activitiesData && activitiesData.length > 0 ? (
            activitiesData.map((activity) => 
            <div key={activity._id}>
              <ActivityCard  activity={activity} updateActivities={updateActivities}/>
              </div>)
          ) : (
            <div style={styles.placeholderStyle}>
              <Image 
                imageName= {isActivitiesExpanded ? "no_activities_placeholder.png"  :  "more_green.svg"}
                width={isActivitiesExpanded ? "200"  :  "30"}
                height={isActivitiesExpanded ? "170"  :  "10"}
              />
            </div>
          )}
        </div> {/* Activity container*/}
      </div> 
    );
  };

  return <PageContainer style={styles.pageStyle}>
      <div style={styles.columnStyle}>
        {!isSmallScreen && <DatePicker/>}
        <styles.responsiveMainContainer>
          <styles.responsiveSubContainer>
            <styles.columnLeftStyle>  
              <Statistic foodData={food}/>
              {/* Conditionally render Chart based on screen size */}
              {!isSmallScreen && <Chart categories={categoriesData} />}
            </styles.columnLeftStyle>
            <styles.columnLeftStyle>    
            <Meals mealsData={meals}/>
            </styles.columnLeftStyle>
          </styles.responsiveSubContainer>

          <Activities activitiesData={activities}/>
      
        </styles.responsiveMainContainer>
      </div>  
   
 
    {/* Dialog */}
    {dialogOpen && (          
      <Dialog open={dialogOpen} >
        <DialogContent>
          {getDialogContent()}
          </DialogContent>
      </Dialog>
    )}

  </PageContainer>
}

export default Home;
