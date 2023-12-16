/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import MealCard from '../components/MealCard.component';
import * as styles  from '../components/styles/Home.css'
import {Image} from '../components/Image.components'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { loadMeals, loadFood, loadActivities, loadTrainings, addMeal, addActivity, addTraining, getAllFoodCategories} from "../graphql/graphqlUtils";
import ActivityCard from '../components/ActivityCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewActivityForm from "../components/NewActivityForm.component";
import * as Enums from "../helpers/Enums.helper"
import ChartPie from '../components/ChartPie.components'
import {FoodCategoryRow, ToggleStatisticSection, CaloriesStatisticSection, CategoriesStatisticSection } from "../components/Statistic.components"
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from "../helpers/Constants.helper"
import {useLoadMealsForDate, useLoadFoodCategories,  useLoadFoodForDate, useLoadActivitiesForDate} from "../hooks/query.hooks"
import Spiner from "../components/Spinner.components"

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

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
      console.log("addActivity form", form)
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
    } 
  };

  // Function is responsible for creating a new meal
  const addMealForDate = async () => {
    const isAdded = await addMeal(user, currentProfile, currentDate)  
    if (isAdded) {
      // updateMeals();
    }
  };

  // Function is responsible for creating a new activity
  const addActivityForDate = async (data) => {
    const isAdded = await addActivity(user, currentProfile, currentDate, data)  
    if (isAdded) {
      // updateActivities();
    }
  };

  // Responsible for fetching data for  meals/traings/activities/food when data is changed
  useEffect(() => {
    if (currentDate === null || currentDate === undefined) {
      setCurrentDate( new Date())
      saveState('currentDate',  new Date());
    } else {    
      saveState('currentDate', currentDate);
    }
  }, [currentDate, currentProfile]);

  const updateCategories= () => {
    // loadFoodCategories();
  }

  const updateMeals = async  () => {
    // await loadMealsForDate();
  }

  const updateFood = () => {
    // loadFoodForDate();
  }

  const updateActivities = () => {
    // loadActivitiesForDate();
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
  
  const Statistic = () => {
    // if ((currentProfile) && (user)) return

    const [isStatisticExpanded, setStatisticExpanded] = useState(!isSmallScreen);
    const [isStatisticToday, setStatisticToday] = useState(true);
    const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useLoadFoodForDate(user, currentProfile, currentDate, isStatisticToday);
    const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useLoadFoodCategories(user, currentProfile, currentDate);
    const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useLoadActivitiesForDate(user, currentProfile, currentDate);
 
    return (
      <div style={{...styles.childConteinerStyle,  marginTop: isSmallScreen? '10px' : '0'}}> 
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
        {(isLoadingFood || isLoadingCategories || isLoadingActivities) ? 
        (
        <div style={styles.statisticContainerStyle}>
          <div style={styles.placeholderStyle}>
             <LoadingAndError 
              isLoading = {isLoadingFood || isLoadingCategories || isLoadingActivities} 
              isError = {isErrorFood || isErrorCategories || isErrorActivities}
             />
          </div>
        </div>
        ) : 
        (
          <div style={styles.statisticContainerStyle}>
          <CaloriesStatisticSection
            foodData={food}
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
                  foodData={food}
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
        ) 
        }
        
      </div> 
    );
  };

 const LoadingAndError = (isLoading, isError) => {
  if (isLoading) {
    return (
      <div style={styles.placeholderStyle}>
        <Spiner/>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={styles.placeholderStyle}>
        <Image imageName="general_error.png" width="200" height="250"/>
      </div>
    )
  }
 }




  const Chart = () => {
    const { data: categories, isLoading, isError } = useLoadFoodCategories(user, currentProfile, currentDate);
    return (
      <div style={styles.childConteinerStyle}> 
        <div style={styles.headerStyle}>
        <div style={styles.headerTiteStyle}>
          
          <div style={styles.headerArrowStyle} >
            <Image 
              imageName= {"arrow_down_green.svg" }
              width="20" 
              height="20" 
            />
          </div>
          <div style={styles.headerTextStyle}>
            <h3 style={styles.headingStyle}>DIET BALANCE</h3>
          </div>
        </div>
        </div>
          {/* Chart */}
          { (isLoading) || (isError)? 
          (
          <div style={styles.chartContainerStyle}>
            <div style={styles.placeholderStyle}>
              <LoadingAndError isLoading = {isLoading} isError = {isError}/>
            </div>
          </div>
          ) : 
          (
         <div >
           {categories && categories.length > 0 ? (
            <div style={styles.chartContainerStyle}>
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
            ) : 
            (
            <div style={styles.placeholderStyle}>
              <Image 
                imageName= {"no_data_placeholder.png"}
                width={ "200"}
                height={"170"}
              />
            </div>
            )
          }
          </div>
          )
          }
        </div>
    );
  };

  const Meals = () => {
   const { data: meals, isLoading, isError } = useLoadMealsForDate(user, currentProfile, currentDate);
  // Adds empty meal for date 
  
  if (!isLoading && !isError && (meals === null || meals.length === 0)) {
    addMealForDate()
  }

   console.log("meals",meals)
    return (
      <div>  {/* Meal container*/}
      { (isLoading) || (isError)? 
        (
        <div style={styles.placeholderStyle}>
          <LoadingAndError isLoading = {isLoading} isError = {isError}/>
        </div>
        ) : 
        (
        <div style = {{padding: '0px'}}>  {/* Meal container*/}
          {  
            meals.map((meal, index) => 
            <div key={meal._id}>
              <MealCard meal={meal} index={index + 1} updateMeals={updateMeals} updateFoods={updateFood} mealsCount = {meals.length}/>
            </div>)
          }
        </div>  
        )
      }
      </div>
    );
  };
  
  const Activities = () => {
    const [isActivitiesExpanded, setActivitiesExpanded] = useState(true);
    const { data: activities, isLoading, isError } = useLoadActivitiesForDate(user, currentProfile, currentDate);
    
    console.log("activities",activities)
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
        { (isLoading) || (isError) ?
        (
        <div  style={styles.columnStyle}>
          <div style={styles.placeholderStyle}>
            <LoadingAndError isLoading = {isLoading} isError = {isError}/>
          </div>
        </div>
        ) : 
        (
          <div  style={styles.columnStyle}>{/* Activity container*/}
          {/* Show activity cards if data avaliable, if not -> show placeholder*/}
          { isActivitiesExpanded && activities && activities.length > 0 ? (
            activities.map((activity) => 
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
        </div>  
        ) 
      }
      </div> 
    );
  };

  return <PageContainer style={styles.pageStyle}>
      <div style={styles.columnStyle}>
        {!isSmallScreen && <DatePicker/>}
        <styles.responsiveMainContainer>
          <styles.responsiveSubContainer>
            <styles.columnLeftStyle>  
              <Statistic/>
              {/* Conditionally render Chart based on screen size */}
              {!isSmallScreen && <Chart/>}
            </styles.columnLeftStyle>
            <styles.columnLeftStyle>    
            <Meals/>
            </styles.columnLeftStyle>
          </styles.responsiveSubContainer>

          <Activities/>
      
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
