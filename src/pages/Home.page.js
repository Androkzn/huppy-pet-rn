/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import MealsCard from '../components/MealCard.component';
import * as styles  from '../components/styles/css'
import {Image} from '../components/Image.components'
import CustomDatePicker from "../components/CustomDatePicker.component";
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);
// Get the user's ID
  const userId = user.id;

// Get the current date
const [currentDate, setCurrentDate] = useState(new Date());
 
// Set the time to the beginning of the current date (midnight)
const startToday = new Date(currentDate);
startToday.setHours(0, 0, 0, 0);
const startTodayISOString = startToday.toISOString();

// Set the time to the end of the current date (right before midnight)
const endToday = new Date(currentDate);
endToday.setHours(23, 59, 59, 999);
const endTodayISOString = endToday.toISOString();

const [meals, setMeals] = useState([]);

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

  // Filter only current user related data 
  const queryVariablesMeals = {
    "userId": userId,
    "startDate": startTodayISOString,
    "endDate": endTodayISOString,
  };

  const headers = { Authorization: `Bearer ${user._accessToken}` }

  // loadMeals function is responsible for making the GraphQL
  // request to Realm and update the meals array from the response. 
  const loadMeals = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllMeals,
      queryVariablesMeals,
      headers
    );
    setMeals(_ => resp.meals.map(meal => ({ ...meal, key: meal._id, afterDelete })));
  };

  useEffect(() => {
    loadMeals();
  }, []);

  // Helper function to be performed after an meals has been deleted.
  const afterDelete = () => {
    loadMeals();
  }

  return <PageContainer>
    <h1>All Meals</h1>
    {/* {
      meals.map(meal => <MealsCard {...meal} />)
    } */}
     <DatePicker
      showIcon
      selected={currentDate}
      onChange={(date) => setCurrentDate(date) }

    />
<div style={{ display: 'flex', justifyContent: 'space-between' }}> 
    <div> 
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <h3 css={styles.headingLoginStyle} >MEALS</h3>
          <div style={{ marginLeft: '20px' }}>
            <Image imageName="diary_tab_icon_unselected.svg" width="40" height="50"/>
          </div>
        </div>
        <div>
          Meals...
        </div>  
      </div>
    </div>

    <div> 
      <div css={styles.loginConteinerStyle}>
        <div css={styles.loginHeaderStyle}>
          <h3 css={styles.headingLoginStyle} >ACTIVITIES</h3>
          <div style={{ marginLeft: '20px' }}>
            <Image imageName="activity_tab_icon_unselected.svg" width="40" height="50"/>
          </div>
        </div>
        <div>
          Activities...
        </div>  
      </div>
    </div>
</div>

  </PageContainer>
}

export default Home;