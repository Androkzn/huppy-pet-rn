import { useContext, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import MealsCard from '../components/MealCard.component';

const Home = () => {
  // Fetching user details from UserContext
  const { user } = useContext(UserContext);
// Get the user's ID
  const userId = user.id;

// Get the current date
const currentDate = new Date();

// Set the time to the beginning of the current date (midnight)
const startToday = new Date(currentDate);
startToday.setHours(0, 0, 0, 0);
const startTodayISOString = startToday.toISOString();

// Set the time to the end of the current date (right before midnight)
const endToday = new Date(currentDate);
endToday.setHours(23, 59, 59, 999);
const endTodayISOString = endToday.toISOString();

const [meals, setMeals] = useState([]);

// GraphQL query to fetch all the meals
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

  // Since we don't want to filter the results as of now,
  // we will just use the empty query object
  const queryVariables = {
    "userId": userId,
    "startDate": startTodayISOString,
    "endDate": endTodayISOString,
  };

  // To prove that the identity of the user, we are attaching
  // an Authorization Header with the request
  const headers = { Authorization: `Bearer ${user._accessToken}` }

  // loadMeals function is responsible for making the GraphQL
  // request to Realm and update the meals array from the response. 
  const loadMeals = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllMeals,
      queryVariables,
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
    {
      meals.map(meal => <MealsCard {...meal} />)
    }
  </PageContainer>
}

export default Home;