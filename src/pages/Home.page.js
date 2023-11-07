/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import MealCard from '../components/MealCard.component';
import * as styles  from '../components/styles/Home.css'
import {Image} from '../components/Image.components'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { act } from '@testing-library/react';
 
const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);
  const { currentProfile } = useContext(UserContext);

  // Get the user's ID
  const userId = user.id;
  let profileId = ""
  
  // Get the current profile ID
  if (currentProfile) {
    profileId =  currentProfile._id;
  }
   
  // Get the current date
  const initialDate = new Date(); 
  const [currentDate, setCurrentDate] = useState(initialDate);
  
  // Set the time to the beginning of the current date (midnight)
  const startToday = new Date(currentDate);
  startToday.setHours(0, 0, 0, 0);
  const startTodayISOString = startToday.toISOString();

  // Set the time to the end of the current date (right before midnight)
  const endToday = new Date(currentDate);
  endToday.setHours(23, 59, 59, 999);
  const endTodayISOString = endToday.toISOString();

  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trainings, setTrainings] = useState([]);

  // GraphQL query to fetch all the meals for specific time interval
  const getAllMeals = gql`
    query getAllMeals($userId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      meals(query: { userId: $userId, date_gte: $startDate, date_lte: $endDate  }) {
        _id
        date
        profileId
        userId
      }
    }
  `;

   // GraphQL query to fetch all the activities for specific time interval
   const getAllActivities = gql`
   query getAllActivities($userId: String!, $startDate: DateTime!, $endDate: DateTime!) {
     activities(query: { userId: $userId, date_gte: $startDate, date_lte: $endDate  }) {
       _id
       date
       burnedCalories
       distance
       duration
       metric
       type
       profileId
       userId
     }
   }
 `;

  // GraphQL query to fetch all the trainings for specific time interval
  const getAllTrainings = gql`
    query getAllTrainings($userId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      trainings(query: { userId: $userId, date_gte: $startDate, date_lte: $endDate  }) {
        _id
        date
        category
        customCategory
        customType
        desc
        isCompleted
        type
        profileId
        userId
      }
    }
  `;

  // Filter only current user with current profile  
  const queryVariables = {
    "userId": userId,
    "profileId": profileId,
    "startDate": startTodayISOString,
    "endDate": endTodayISOString,
  };

  // Authorization header
  const headers = { Authorization: `Bearer ${user._accessToken}` }

  // loadMeals function is responsible for making the GraphQL
  // request to Realm and update the meals array from the response. 
  const loadMeals = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllMeals,
      queryVariables,
      headers
    );
    setMeals([])
    setMeals(_ => resp.meals.map(meal => ({ ...meal, key: meal._id, update })));
  };

  // loadActivities function is responsible for making the GraphQL
  // request to Realm and update the activities array from the response. 
  const loadActivities = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllActivities,
      queryVariables,
      headers
    );
    setActivities([])
    setActivities(_ => resp.activities.map(activity => ({ ...activity, key: activity._id, update })));
  };

  // loadTrainings function is responsible for making the GraphQL
  // request to Realm and update the trainings array from the response. 
  const loadTrainings = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllTrainings,
      queryVariables,
      headers
    );
    setTrainings([])
    setTrainings(_ => resp.trainings.map(training => ({ ...training, key: training._id, update })));
  };

 
    // addMeal function is responsible for creating the
    // meal and then calling the
    // updateMeals to show new meal. 
    const addMeal = async () => {
      // GraphQL query to create an meal
      const createMealQuery = gql`
      mutation AddMeal($data: MealInsertInput!) {
        insertOneMeal(data: $data) {
          _id
        }
      }
      `;

      // All the data that needs to be sent to the GraphQL endpoint
      // to create an meal will be passed through queryVariablesCreateMeal.
      const queryVariablesCreateMeal = {
        data: {
          date: (currentDate).toISOString(),
          profileId: profileId,
          userId: userId
        }
      };

      try {
        await request(GRAPHQL_ENDPOINT, createMealQuery, queryVariablesCreateMeal, headers);
        updateMeals();
        
      } catch (error) {
        alert(error);
      }
    };

    

    const addActivity = async () => {
      // GraphQL query to create an Activity
      const createActivityQuery = gql`
      mutation AddActivity($data: ActivityInsertInput!) {
        insertOneActivity(data: $data) {
          _id
        }
      }
      `;

      // All the data that needs to be sent to the GraphQL endpoint
      // to create an Activity will be passed through queryVariablesCreateActivity.
      const queryVariablesCreateActivity = {
        data: {
          date: (new Date()).toISOString(),
          profileId: profileId,
          userId: userId
        }
      };
      
      try {
        await request(GRAPHQL_ENDPOINT, createActivityQuery, queryVariablesCreateActivity, headers);
        updateMeals();
         
      } catch (error) {
        alert(error);
      }
    };


    const addTraining = async () => {
          // GraphQL query to create an Training
      const createTrainingQuery = gql`
        mutation AddTraining($data: TrainingInsertInput!) {
          insertOneTraining(data: $data) {
            _id
          }
        }
        `;

      // All the data that needs to be sent to the GraphQL endpoint
      // to create an Training will be passed through queryVariablesCreateTraining.
      const queryVariablesCreateTraining = {
        data: {
          date: (new Date()).toISOString(),
          profileId: profileId,
          userId: userId
        }
      };

      try {
        await request(GRAPHQL_ENDPOINT, createTrainingQuery, queryVariablesCreateTraining, headers);
        updateMeals();
       
      } catch (error) {
        alert(error);
      }
    };

  // Responsible for fetching data for  meals/traings/activities when data is changed
  useEffect(() => {
    update()
  }, [currentDate]);

  // Helper function to be performed after an meals/traing/activity has been deleted.
  const update = () => {
    loadMeals();
    loadActivities();
    loadTrainings();
  }

  const updateMeals = () => {
    loadMeals();
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
                    onClick={addMeal}
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
                    onClick={addActivity}
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
              onClick={addTraining}
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

