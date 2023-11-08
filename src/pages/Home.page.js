/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import MealCard from '../components/MealCard.component';
import * as styles  from '../components/styles/Home.css'
import {Image} from '../components/Image.components'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { Link } from "react-router-dom";
import { loadMeals, loadActivities, loadTrainings, addMeal, addActivity, addTraining, } from "../graphql/graphqlUtils";

const Home = () => {
  // Fetching user details from UserContext
  const { user, currentProfile } = useContext(UserContext);

  const [currentDate, setCurrentDate] = useState( new Date());
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trainings, setTrainings] = useState([]);

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
    const activities = await loadActivities(user, currentProfile, currentDate); 
    setActivities(activities);
  };

  // Function is responsible for making the GraphQL
  // request to Realm and update the trainings array from the response. 
  const loadTrainingsForDate = async () => {
    const trainings = await loadTrainings(user, currentProfile, currentDate); 
    setTrainings(trainings);
  };

  // Function is responsible for creating a new meal
  const addMealForDate = async () => {
    const isAdded = await addMeal(user, currentProfile, currentDate)  
    if (isAdded) {
      updateMeals();
    }
  };

  // Function is responsible for creating a new activity
  const addActivityForDate = async () => {
    const isAdded = await addActivity(user, currentProfile, currentDate)  
    if (isAdded) {
      updateActivities();
    }
  };

  // Function is responsible for creating a new training
  const addTrainingForDate = async () => {
    const isAdded = await addTraining(user, currentProfile, currentDate)  
    if (isAdded) {
      updateTrainings();
    }
  };

  // Responsible for fetching data for  meals/traings/activities when data is changed
  useEffect(() => {
    updateAll()
  }, [currentDate]);

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
                    onClick={addActivityForDate}
                  >
                    <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
                  </button>
                </div>{/* Header container*/}
                <div  css={styles.columnStyle}>{/* Activity container*/}
                  {/* Show activity cards if data avaliable, if not -> show placeholder*/}
                  {activities.length > 0 ? (
                    activities.map((activity) => 
                    <div key={activity._id}>
                      {activity.date}
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
              onClick={addTrainingForDate}
            >
              <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
            </button>
          </div>{/* Header container*/}

          <div css={styles.columnStyle}>{/* Training container*/}
            {trainings.length > 0 ? (
              trainings.map((training) => <div key={training._id}>{training.date}</div>)
            ) : (
              <div css={styles.placeholderStyle}>
                <Image imageName="no_trainings_placeholder.png" width="200" height="170" />
              </div>
            )}
          </div>{/* Training container*/}
        </div>{/* Trainings container*/}
      </div>{/* Right column (Training) */}
    </div>{/* Two columns (Picker, Statistic, Meals+Activities) and (Training) in a row*/}
  </PageContainer>
}

export default Home;

