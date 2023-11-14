/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import MealCard from '../components/MealCard.component';
import * as styles  from '../components/styles/Home.css'
import {Image} from '../components/Image.components'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { loadMeals, loadActivities, loadTrainings, addMeal, addActivity, addTraining, } from "../graphql/graphqlUtils";
import ActivityCard from '../components/ActivityCard.component';
import TrainingCard from '../components/TrainingCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewActivityForm from "../components/NewActivityForm.component";
import NewTrainingForm from "../components/NewTrainingForm.component";
import * as Enums from "../helpers/Enums.helper"

const Home = () => {
  const {user, currentProfile } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState( new Date());
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addActivity");

  const openDialog = (dialogTypeNew) => {
    console.log("openDialog", dialogTypeNew)
    setDialogType(dialogTypeNew)
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

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
    } else if (dialogType === "addTraining") {
      let  customCategory = form.customCategory;
      // Check if custom type was selected  under base category
      if (form.category !=  Enums.TrainingCategory.CUSTOM && form.type === Enums.TrainingType.CUSTOM) {
        customCategory = Enums.getTitleForTrainingCategory(form.category)
      }

      const data = {
        "category": form.category,
        "type": form.type,
        "customCategory": customCategory,
        "customType": form.customType,
        "desc": form.description,
      }

      addTrainingForDate(data)
    }
      
    closeDialog();
  };

  const getDialogContent = () => {
    console.log("getDialogContent", dialogType)
    if (dialogType === "addActivity") { 
      return <NewActivityForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } else if (dialogType === "addTraining") {
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } 
  };

  // Function is responsible for making the GraphQL
  // request to Realm and update the meals array from the response. 
  const loadMealsForDate = async () => {
    if (currentProfile) {
      const meals = await loadMeals(user, currentProfile, currentDate); 
      setMeals(meals);
    }
  };

  // Function is responsible for making the GraphQL
  // request to Realm and update the activities array from the response. 
  const loadActivitiesForDate = async () => {
    if (currentProfile) {
      const activities = await loadActivities(user, currentProfile, currentDate); 
      setActivities(activities);
    }
  };

  // Function is responsible for making the GraphQL
  // request to Realm and update the trainings array from the response. 
  const loadTrainingsForDate = async () => {
    if (currentProfile) {
      const trainings = await loadTrainings(user, currentProfile, currentDate); 
      setTrainings(trainings);
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

  // Function is responsible for creating a new training
  const addTrainingForDate = async (data) => {
    const isAdded = await addTraining(user, currentProfile, currentDate, data)  
    if (isAdded) {
      updateTrainings();
    }
  };

  // Responsible for fetching data for  meals/traings/activities when data is changed
  useEffect(() => {
    updateAll()
  }, [currentDate, currentProfile]);
 
  // Helper function to be performed after an meals/traing/activity has been deleted.
  const updateAll = () => {
    updateMeals()
    updateActivities()
    updateTrainings()
  }

  const updateMeals = () => {
    loadMealsForDate();
  }

  const updateActivities = () => {
    loadActivitiesForDate();
  }

  const updateTrainings = () => {
    loadTrainingsForDate();
  }

  return <PageContainer>
    <div css={styles.rowStyle}> {/* Two columns (Picker, Statistic, Meals+Activities) and (Training) in a row*/}
      <div css={styles.columnLeftStyle}> {/* Left columns (Picker, Statistic, Meals+Activities)*/} 

        <div css={styles.rowStyle}> {/* Date picker container*/}
          <div css={styles.columnStyle}> 
            <div css={styles.pickerContainerStyle}> 
              <CustomDatePickerWithArrows
                label="Select date:"
                value={currentDate}
                onChange={(date) => setCurrentDate(date) }
                styleContainer= {styles.pickerStyle}
              />
            </div>
          </div>
        </div>{/* Date picker container*/}

        <div css={styles.rowStyle}> {/* Statistic container*/}
          <div css={styles.columnStyle}> 
              <div >
                <div css={styles.headerStyle}>
                  <div css={styles.headerTextStyle}>
                    <h3 css={styles.headingStyle}>STATS</h3>
                    <h3 css={styles.headingStyle}>Today/goal</h3>
                    <h3 css={styles.headingStyle}>DIET PERCENTAGE</h3>
                  </div>
                </div>
                <div>
                  Show statistic here
                </div>
            </div>
          </div>
        </div>{/* Statistic container*/}

        <div css={styles.rowStyle}>   {/* Meals + Activities container*/}
          <div css={styles.twoColumnStyle}>   {/* Meals column container*/}
              <div css={styles.childConteinerStyle}> {/* Meals container*/}
                
                <div css={styles.headerStyle}>{/* Header container*/}
                  <div css={styles.headerTiteStyle}>
                    <h3 css={styles.headingStyle}>MEALS</h3>
                    <div css={styles.headerImageStyle} >
                      <Image imageName="diary_tab_icon_unselected.svg" width="40" height5="40"/>
                    </div>
                  </div>
                  <button
                    css={styles.headerAddButtonStyle}
                    onClick={addMealForDate}
                  >
                    <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
                  </button>
                </div> {/* Header container*/}
                
                <div  css={styles.columnStyle}>  {/* Meal container*/}
                  {/* Show meals cards if data avaliable, if not -> show placeholder*/}
                  {meals.length > 0 ? (
                    meals.map((meal) => 
                    <div key={meal._id}>
                      <MealCard meal={meal} updateMeals={updateMeals}/>
                    </div>)
                  ) : (
                    <div css={styles.placeholderStyle}>
                      <Image imageName="no_meals_placeholder.png" width="200" height="170" />
                    </div>
                  )}

                </div> {/* Meals container*/}
              </div> {/* Meals column container*/}
          </div> {/* Meals container*/}
        
          <div css={styles.twoColumnStyle}>  {/* Activities column container*/}
              <div css={styles.childConteinerStyle}> {/* Activities container*/}
                
                <div css={styles.headerStyle}>{/* Header container*/}
                  <div css={styles.headerTiteStyle}> 
                    <h3 css={styles.headingStyle} >ACTIVITIES</h3>
                    <div css={styles.headerImageStyle}>
                      <Image imageName="activity_tab_icon_unselected.svg" width="40" height="50"/>
                    </div>
                  </div>
                  <button
                    css={styles.headerAddButtonStyle}
                    onClick={() => {
                      openDialog("addActivity");
                    }}
                  >
                    <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
                  </button>
                </div>{/* Header container*/}
                <div  css={styles.columnStyle}>{/* Activity container*/}
                  {/* Show activity cards if data avaliable, if not -> show placeholder*/}
                  {activities.length > 0 ? (
                    activities.map((activity) => 
                    <div key={activity._id}>
                      <ActivityCard  activity={activity} updateActivities={updateActivities}/>
                      </div>)
                  ) : (
                    <div css={styles.placeholderStyle}>
                      <Image imageName="no_activities_placeholder.png" width="200" height="170" />
                    </div>
                  )}
                </div> {/* Activity container*/}
              </div>{/* Activities container*/}
            </div>{/* Activities column container*/} 
          </div>{/* Meals + Activities container*/}
      </div> {/* Left columns (Picker, Statistic, Meals+Activities)*/} 

      <div css={styles.columnRightStyle }> {/* Right column (Training) */}
        <div css={styles.childConteinerStyle}> {/* Trainings container*/}
          <div css={styles.headerStyle}>{/* Header container*/}
          <div css={styles.headerTiteStyle}> 
            <h3 css={styles.headingStyle} >TRAINING</h3>
            <div css={styles.headerImageStyle}>
              <Image imageName="training_tab_icon_unselected.svg" width="40" height="50"/>
            </div>
            </div>
            <button
                    css={styles.headerAddButtonStyle}
                    onClick={() => {
                      openDialog("addTraining");
                    }}
                  >
              <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
            </button>
          </div>{/* Header container*/}

          <div css={styles.columnStyle}>{/* Training container*/}
            {trainings.length > 0 ? (
              trainings.map((training) => <div key={training._id}>
                 <TrainingCard training={training} updateTrainings={updateTrainings}/>
                </div>)
            ) : (
              <div css={styles.placeholderStyle}>
                <Image imageName="no_trainings_placeholder.png" width="200" height="170" />
              </div>
            )}
          </div>{/* Training container*/}
        </div>{/* Trainings container*/}
      </div>{/* Right column (Training) */}
    </div>{/* Two columns (Picker, Statistic, Meals+Activities) and (Training) in a row*/}
 
    {/* Dialog for delete confirmation */}
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
