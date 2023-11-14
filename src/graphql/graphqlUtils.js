
import request, { gql } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import { getStartAndEndOfToday } from "../helpers/Date.helper";

// Func that is responsible for searching Food Templates in DB 
// it return array of FoodTemplates based on search string
async function searchForFood(searchQuery, user) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const searchFoodQuery = gql`
    query SearchFood($searchQuery: String!) {
        search(input: $searchQuery) {
            _id
            bonesRatio
            calories
            caloriesServing
            categoryType
            image
            meatRatio
            name
            servingWeight
            servings
            units
            weight
            type
            userId
        }
    }
    `;

    const queryVariables = {
        searchQuery: searchQuery,
    };

    try {
        const resp = await request(GRAPHQL_ENDPOINT, searchFoodQuery, queryVariables, headers);
        if (resp.search) {
        return resp.search;
        }
    } catch (error) {
        console.error('Error search for food with string:', searchQuery, error);
        return [];
    }
}

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
async function getAllFoodForMeal(user, mealId) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // GraphQL query to fetch all  food for specificmeal
    const getAllFoodForMeal = gql`
        query getAllFoodForMeal($mealId: String!) {
            foods(query: { mealId: $mealId}) {
            _id
            bonesRatio
            calories
            caloriesServing
            categoryType
            image
            mealId
            meatRatio
            name
            servingWeight
            servings
            templateId
            units
            weight
            type
            userId
            }
        }
    `;
    const queryVariables = {
        "mealId": mealId,
    };
 
    try {
        
        const resp = await request(GRAPHQL_ENDPOINT, getAllFoodForMeal, queryVariables, headers);
        
        // Update the 'food' state with the fetched data
        return resp.foods;
    } catch (error) {
        alert('Error fetching food for meal with Id:', mealId, error);
    }
}

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
async function deleteMeal(user, _id) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // GraphQL query to delete an meal
    const deleteMealQuery = gql`
        mutation DeleteMeal($query: MealQueryInput!) {
            deleteOneMeal(query: $query) {
                _id
            }
        }
    `;

    const queryVariables = { query: { _id } };

    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this meal?");
    if (!resp) return;

    try {
        await request(GRAPHQL_ENDPOINT, deleteMealQuery, queryVariables, headers);
        return true
      } catch (error) {
        alert('Error deleting meal with Id:',_id, error);
        return false
      }
}

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
async function deleteActivity(user, _id) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // GraphQL query to delete an meal
    const deleteActivityQuery = gql`
        mutation DeleteActivity($query: ActivityQueryInput!) {
            deleteOneActivity(query: $query) {
                _id
            }
        }
    `;

    const queryVariables = { query: { _id } };

    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this activity?");
    if (!resp) return;

    try {
        await request(GRAPHQL_ENDPOINT, deleteActivityQuery, queryVariables, headers);
        return true
      } catch (error) {
        alert('Error deleting meal with Id:',_id, error);
        return false
      }
}

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
async function deleteTraining(user, _id) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // GraphQL query to delete an meal
    const deleteTrainingQuery = gql`
        mutation DeleteTraining($query: TrainingQueryInput!) {
            deleteOneTraining(query: $query) {
                _id
            }
        }
    `;

    const queryVariables = { query: { _id } };

    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this training?");
    if (!resp) return;

    try {
        await request(GRAPHQL_ENDPOINT, deleteTrainingQuery, queryVariables, headers);
        return true
      } catch (error) {
        alert('Error deleting meal with Id:',_id, error);
        return false
      }
}

// Func that is responsible for adding Food to DB   
// it return bool value
async function addFood(user, currentProfile, mealId, form) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };

        // All the data that needs to be sent to the GraphQL endpoint
    // to create food will be passed through queryVariablesCreateFood.
    const queryVariablesCreateFood = {
        data: {
          bonesRatio:  form.bonesRatio,
          calories:  form.calories,
          caloriesServing:  form.caloriesServing,
          categoryType:  form.category,
          image: "",
          mealId:  form.mealId,
          meatRatio:  form.meatRatio,
          name:  form.name,
          servingWeight:  form.servingWeight,
          servings: form.servings,
          templateId: "",
          type:  form.type,
          units: form.units, 
          weight: 0,
          profileId: profileId,
          userId: userId
        }
      };

      // GraphQL query to create food
    const createFoodQuery = gql`
        mutation AddFood($data: FoodInsertInput!) {
            insertOneFood(data: $data) {
                _id
            }
        }
    `;

    try {
        await request(GRAPHQL_ENDPOINT, createFoodQuery, queryVariablesCreateFood, headers);
        return true
      } catch (error) {
        alert('Error adding food:',error);
        return false
      }
}

// Func that is responsible for fetching  all all profiles for specific user
// it returna arrayprofiles and current profile
async function getUserProfiles(user) {
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const userId = user.id

    // GraphQL query to fetch all the meals for specific time interval
    const getProfiles = gql`
    query getProfiles($userId: String!) {
        profiles(query: { userId: $userId }) {
            _id
            avatar
            breed
            categories {
                _id
                color
                index
                name
                profileId
                percentage
                type
                userId
                weight
            }
            dailyPortion
            dailyRatio
            dob
            isCurrent
            name
            preset
            size
            userId
            weight
            activityType
            deductCalories 
            }
        }
    `;

  // Filter only current user related data 
  const queryVariablesProfiles = {
    "userId": userId,
  };

  try {
    const resp = await request(GRAPHQL_ENDPOINT, getProfiles, queryVariablesProfiles, headers);
    const profiles = resp.profiles.map(profile => ({ ...profile, key: profile._id })) 
    const currentProfileFetched = resp.profiles.filter(profile => profile.isCurrent === true);
    const currentProfile = currentProfileFetched[0];
    return { profilesFetched: profiles, currentProfileFetched: currentProfile };
  } catch (error) {
    console.error('Error loading profiles:', error);
  }
}

async function loadMeals(user, currentProfile, currentDate) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };
    const { startToday, endToday } = getStartAndEndOfToday(currentDate);

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

  // Filter only current user with current profile  
  const queryVariables = {
    "userId": userId,
    "profileId": profileId,
    "startDate": startToday,
    "endDate": endToday,
  };

  try {
    const resp = await request(GRAPHQL_ENDPOINT,
        getAllMeals,
        queryVariables,
        headers
      );
      const meals = resp.meals.map(meal => ({ ...meal, key: meal._id }))
      return(meals) 
  } catch (error) {
    console.error('Error loading meals:', error);
  }

}

async function loadActivities(user, currentProfile, currentDate) {
  
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };
    const { startToday, endToday } = getStartAndEndOfToday(currentDate);

    console.log("currentProfile", currentProfile)
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
  // Filter only current user with current profile  
  const queryVariables = {
    "userId": userId,
    "profileId": profileId,
    "startDate": startToday,
    "endDate": endToday,
  };

  try {
    const resp = await request(GRAPHQL_ENDPOINT,
      getAllActivities,
      queryVariables,
      headers
    );
    const activities = resp.activities.map(activity => ({ ...activity, key: activity._id}))
    return(activities) 
  } catch (error) {
    console.error('Error loading Activities:', error);
  }
}

async function loadTrainings(user, currentProfile, currentDate) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };
    const { startToday, endToday } = getStartAndEndOfToday(currentDate);

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
    "startDate": startToday,
    "endDate": endToday,
  };

  try {
    const resp = await request(GRAPHQL_ENDPOINT,
        getAllTrainings,
        queryVariables,
        headers
      );
    const trainings =  resp.trainings.map(training => ({ ...training, key: training._id }))
    return(trainings)
} catch (error) {
    console.error('Error loading trainings:', error);
  }
}

async function addMeal(user, currentProfile, selectedDate) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };

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
         date: selectedDate.toISOString(),
         profileId: profileId,
         userId: userId
       }
     };

    try {
        await request(GRAPHQL_ENDPOINT, createMealQuery, queryVariablesCreateMeal, headers);
        return true
    } catch (error) {
      console.error('Error adding meal:', error);
      return false
    }
}

async function addActivity(user, currentProfile, selectedDate, data) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };

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
        ...data, // Merge the provided activity data  
        date: selectedDate.toISOString(),
        profileId: profileId,
        userId: userId
    }
    };

    try {
        await request(GRAPHQL_ENDPOINT, createActivityQuery, queryVariablesCreateActivity, headers);
        return true
    } catch (error) {
        console.error('Error adding activity:', error);
        return false
    }
}

async function addTraining(user, currentProfile, selectedDate, data) {
    const accessToken = user._accessToken;
    const profileId = currentProfile._id
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };
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
            ...data, // Merge the provided activity data  
            isCompleted: false,
            date: selectedDate.toISOString(),
            profileId: profileId,
            userId: userId
        }
    };

    try {
        await request(GRAPHQL_ENDPOINT, createTrainingQuery, queryVariablesCreateTraining, headers);
        return true
    } catch (error) {
        console.error('Error adding training:', error);
        return false
    }
}

// Function to update an activity
async function updateActivity(user, activityId, updateData) {
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an activity
  const updateActivityQuery = gql`
      mutation UpdateActivity($activityId: ObjectId!, $updateData: ActivityUpdateInput!) {
          updateOneActivity(query: { _id: $activityId }, set: $updateData) {
              _id
              burnedCalories
              distance
              duration
              metric
              type
          }
      }
  `;

  const queryVariables = {
      activityId,
      updateData,
  };

  try {
      const updatedActivity = await request(GRAPHQL_ENDPOINT, updateActivityQuery, queryVariables, headers);
      return updatedActivity;
  } catch (error) {
      alert(error);
      return null;
  }
}

// Function to update an training
async function updateTraining(user, trainingId, updateData) {
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an training
  const updateTrainingQuery = gql`
      mutation UpdateTraining($trainingId: ObjectId!, $updateData: TrainingUpdateInput!) {
          updateOneTraining(query: { _id: $trainingId }, set: $updateData) {
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

  const queryVariables = {
      trainingId,
      updateData,
  };

  try {
      const updatedTraining = await request(GRAPHQL_ENDPOINT, updateTrainingQuery, queryVariables, headers);
      return updatedTraining;
  } catch (error) {
      alert(error);
      return null;
  }
}

export { 
    searchForFood, 
    getAllFoodForMeal, 
    deleteMeal,
    deleteActivity,
    deleteTraining,
    getUserProfiles,
    loadMeals,
    loadActivities,
    loadTrainings,
    addMeal,
    addActivity,
    addTraining,
    addFood, 
    updateActivity,
    updateTraining,
};