
import request, { gql } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import { getStartAndEndOfToday, getStartAndEndOfWeek } from "../helpers/Date.helper";

// Func that is responsible for searching Food Templates in DB 
// it return array of FoodTemplates based on search string
async function searchForFood(searchQuery, user) {
  if (!user) { return []}
    const accessToken = user._accessToken;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const searchFoodTemplateQuery = gql`
    query SearchFoodTemplate($searchQuery: String!) {
      
        search(input: $searchQuery) {
          _id
          ash
          bonesRatio
          calories
          caloriesServing
          carb
          categoryType
          desc
          fat
          fiber
          image
          isCustom
          meatRatio
          name
          protein
          servingWeight
          servings
          type
          units
          userId
          weight
        }
    }
    `;

    const queryVariables = {
        searchQuery: searchQuery,
    };

    try {
        const resp = await request(GRAPHQL_ENDPOINT, searchFoodTemplateQuery, queryVariables, headers);
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
  if (!user) { return []}
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
            date
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

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
async function getAllCustomFoodTemplates(user) {
  if (!user) { return []}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllCustomFoodTemplates = gql`
      query getAllCustomFoodTemplates {
        foodTemplates(query: { isCustom: true}) {
            _id
            ash
            bonesRatio
            calories
            caloriesServing
            carb
            categoryType
            desc
            fat
            fiber
            image
            isCustom
            meatRatio
            name
            protein
            servingWeight
            servings
            type
            units
            userId
            weight
          }
      }
  `;
  const queryVariables = {};

  try {
      const resp = await request(GRAPHQL_ENDPOINT, getAllCustomFoodTemplates, queryVariables, headers);
      // Update the 'food' state with the fetched data
      return resp.foodTemplates;
  } catch (error) {
      alert(error);
  }
}

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
async function getAllFoodTemplatesForCategory(user, categoryType) {
  if (!user) { return []}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllFoodTemplatesForCategory = gql`
      query getAllFoodTemplatesForCategory($categoryType: String!) {
          foodTemplates(query: { categoryType: $categoryType}) {
            _id
            ash
            bonesRatio
            calories
            caloriesServing
            carb
            categoryType
            desc
            fat
            fiber
            image
            isCustom
            meatRatio
            name
            protein
            servingWeight
            servings
            type
            units
            userId
            weight
          }
      }
  `;
  const queryVariables = {
      "categoryType": categoryType.toLowerCase(),
  };

  try {
      
      const resp = await request(GRAPHQL_ENDPOINT, getAllFoodTemplatesForCategory, queryVariables, headers);
      
      // Update the 'food' state with the fetched data
      return resp.foodTemplates;
  } catch (error) {
      alert(error);
  }
}

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
async function getAllFoodCategories(user, profileId) {
  if (!user) { return []}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllFoodCategories = gql`
      query getAllFoodCategories($profileId: String!) {
        foodCategories(query: { profileId: $profileId}) {
          _id
          type
          index
          color
          name
          percentage
          weight
          profileId
          userId
          }
      }
  `;
  const queryVariables = {
    "profileId": profileId,
  };

  try {
      const resp = await request(GRAPHQL_ENDPOINT, getAllFoodCategories, queryVariables, headers);
      // Update the 'food' state with the fetched data
      return resp.foodCategories;
  } catch (error) {
      alert(error);
  }
}

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
async function deleteMeal(user, _id) {
  if (!user) { return false}
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
  if (!user) { return false}
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
  if (!user) { return false}
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

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
async function deleteFood(user, _id) {
  if (!user) { return false}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to delete an meal
  const deleteFoodQuery = gql`
      mutation DeleteFood($query: FoodQueryInput!) {
          deleteOneFood(query: $query) {
              _id
          }
      }
  `;

  const queryVariables = { query: { _id } };

  try {
      await request(GRAPHQL_ENDPOINT, deleteFoodQuery, queryVariables, headers);
      return true
    } catch (error) {
      alert('Error deleting food with Id:',_id, error);
      return false
    }
}

// Func that is responsible for deleting a food template based on the expense-id
// it return bool value
async function deleteFoodTemplate(user, _id) {
  if (!user) { return false}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

   // Confirming the user's action
   const resp = window.confirm("Are you sure you want to delete this food forever?");
   if (!resp) return;

  // GraphQL query to delete an food template
  const deleteFoodTemplateQuery = gql`
      mutation DeleteFoodTemplate($query: FoodTemplateQueryInput!) {
          deleteOneFoodTemplate(query: $query) {
              _id
          }
      }
  `;

  const queryVariables = { query: { _id } };

  try {
      await request(GRAPHQL_ENDPOINT, deleteFoodTemplateQuery, queryVariables, headers);
      return true
    } catch (error) {
      alert(error);
      return false
    }
}

// Func that is responsible for deleting a food template based on the expense-id
// it return bool value
async function deleteFoodCategory(user, _id) {
  if (!user) { return false}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

   // Confirming the user's action
   const resp = window.confirm("Are you sure you want to delete this category?");
   if (!resp) return;

  // GraphQL query to delete an food template
  const deleteFoodCategoryQuery = gql`
      mutation DeleteFoodCategory($query:FoodCategoryQueryInput!) {
          deleteOneFoodCategory(query: $query) {
              _id
          }
      }
  `;

  const queryVariables = { query: { _id } };

  try {
      await request(GRAPHQL_ENDPOINT, deleteFoodCategoryQuery, queryVariables, headers);
      return true
    } catch (error) {
      alert(error);
      return false
    }
}

// Func that is responsible for adding Food to DB   
// it return bool value
async function addFood(user, mealId, foodItem, selectedDate) {
    if (!user) { return false}
    const accessToken = user._accessToken;
    const userId = user.id
    const headers = { Authorization: `Bearer ${accessToken}` };
        // All the data that needs to be sent to the GraphQL endpoint
    // to create food will be passed through queryVariablesCreateFood.
    console.log("addFood", foodItem)
    
    const queryVariablesCreateFood = {
        data: {
          bonesRatio:  foodItem.bonesRatio,
          categoryType: foodItem.categoryType,
          calories:  foodItem.calories,
          caloriesServing:  foodItem.caloriesServing,
          image: "",
          mealId: mealId,
          meatRatio:  foodItem.meatRatio,
          name:  foodItem.name,
          servingWeight:  foodItem.servingWeight,
          servings: foodItem.servings,
          templateId: foodItem._id,
          type:  foodItem.type,
          units: foodItem.units, 
          weight: foodItem.weight,
          userId: userId,
          date: selectedDate,
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
        alert(error);
        return false
      }
}

// Func that is responsible for adding FoodTemplate to DB   
// it return bool value
async function addFoodTemplate(user, foodItem) {
  if (!user) { return { success: false, templateId: "" }}
  const accessToken = user._accessToken;
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  // All the data that needs to be sent to the GraphQL endpoint
  // to create food will be passed through queryVariablesCreateFood.
  const queryVariablesCreateFood = {
      data: {
        bonesRatio:  foodItem.bonesRatio,
        categoryType: foodItem.categoryType,
        calories:  foodItem.calories,
        caloriesServing:  foodItem.caloriesServing,
        image: "",
        meatRatio:  foodItem.meatRatio,
        name:  foodItem.name,
        servingWeight:  foodItem.servingWeight,
        servings: foodItem.servings,
        type:  foodItem.type,
        units: foodItem.units, 
        weight: 0,
        ash: foodItem.ash,
        desc: foodItem.desc,
        fat: foodItem.fat,
        fiber: foodItem.fiber,
        protein: foodItem.protein,
        carb: foodItem.carb,
        isCustom: true,
        userId: userId
      }
    };
    // GraphQL query to create food
  const createFoodQuery = gql`
      mutation AddFoodTemplate($data: FoodTemplateInsertInput!) {
        insertOneFoodTemplate(data: $data) {
            _id
        }
    }
  `;

  try {
     const response =await request(GRAPHQL_ENDPOINT, createFoodQuery, queryVariablesCreateFood, headers);
      // Extract the _id from the response
     const templateId = response.insertOneFoodTemplate._id;
      return { success: true, templateId: templateId };
    } catch (error) {
      alert(error);
      
       return { success: false, templateId: "" };
    }
}


// Func that is responsible for fetching  all all profiles for specific user
// it returna arrayprofiles and current profile
async function getUserProfiles(user) {
  if (!user) { return {}}
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
            isRatioSelected
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
// Func that is responsible for adding FoodTemplate to DB   
// it return bool value
async function addProfile(user, profile) {
  if (!user) { return {}}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const userId = user.id

  // GraphQL query to fetch all the meals for specific time interval
  const createProfileQuery = gql`
  mutation AddProfile($data: ProfileInsertInput!) {
    insertOneProfile(data: $data) {
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
      isRatioSelected
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
  const queryVariablesCreateProfile = {
  data: {

  }
  };
  // Filter only current user related data 
  const queryVariablesProfiles = {
  "userId": userId,
  };

  try {
  const resp = await request(GRAPHQL_ENDPOINT, createProfileQuery, queryVariablesCreateProfile, headers);
  // const profile = resp.profile.map(profile => ({ ...profile, key: profile._id })) 
  // const currentProfileFetched = resp.profiles.filter(profile => profile.isCurrent === true);
  // const currentProfile = currentProfileFetched[0];
  // return { profilesFetched: profiles, currentProfileFetched: currentProfile };
  } catch (error) {
  console.error('Error creating profile:', error);
  }
};


async function loadMeals(user, currentProfile, currentDate, isToday = true) {
  if (!user || !currentProfile) { return []}
  const accessToken = user._accessToken;
  const profileId = currentProfile._id
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = isToday ? getStartAndEndOfToday(currentDate) : getStartAndEndOfWeek(currentDate);

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
    "startDate": start,
    "endDate": end,
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

async function loadFood(user, currentProfile, currentDate, isToday) {
  if (!user || !currentProfile) { return []}
  const accessToken = user._accessToken;
  const profileId = currentProfile._id
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = isToday ? getStartAndEndOfToday(currentDate) : getStartAndEndOfWeek(currentDate);

// GraphQL query to fetch all the meals for specific time interval
const getAllFood = gql`
  query getAllFood($userId: String!, $startDate: DateTime!, $endDate: DateTime!) {
    foods(query: { userId: $userId, date_gte: $startDate, date_lte: $endDate  }) {
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
      date
    }
  }
`;

// Filter only current user with current profile  
const queryVariables = {
  "userId": userId,
  "profileId": profileId,
  "startDate": start,
  "endDate": end,
};

try {
  const resp = await request(GRAPHQL_ENDPOINT,
      getAllFood,
      queryVariables,
      headers
    );
    const food = resp.foods.map(food => ({ ...food, key: food._id }))
    return(food) 
} catch (error) {
  console.error('Error loading meals:', error);
}
}

async function loadActivities(user, currentProfile, currentDate) {
  if (!user) { return []}
  const accessToken = user._accessToken;
  const profileId = currentProfile._id
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = getStartAndEndOfToday(currentDate);

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
    "startDate": start,
    "endDate": end,
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
  if (!user) { return []}
  const accessToken = user._accessToken;
  const profileId = currentProfile._id
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = getStartAndEndOfToday(currentDate);

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
    "startDate": start,
    "endDate": end,
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
    if (!user) { return false}
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

     console.log("selectedDate", selectedDate)
     // All the data that needs to be sent to the GraphQL endpoint
     // to create an meal will be passed through queryVariablesCreateMeal.
     const queryVariablesCreateMeal = {
       data: {
         date: selectedDate,
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
    if (!user) { return false}
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
        date: selectedDate,
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
  if (!user) { return false}
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
            date: selectedDate,
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

async function addFoodCategory(user, currentProfile, data) {
  if (!user) { return false}
  const accessToken = user._accessToken;
  const profileId = currentProfile._id
  const userId = user.id
  const headers = { Authorization: `Bearer ${accessToken}` };
  // GraphQL query to create an Training
  const createFoodCategoryQuery = gql`
  mutation AddFoodCategory($data: FoodCategoryInsertInput!) {
    insertOneFoodCategory(data: $data) {
        _id
    }
  }
  `;

  // All the data that needs to be sent to the GraphQL endpoint
  // to create an Training will be passed through queryVariablesCreateTraining.
  const queryVariablesCreateFoodCategory = {
      data: {
          ...data, // Merge the provided activity data  
          profileId: profileId,
          userId: userId
      }
  };

  try {
      await request(GRAPHQL_ENDPOINT, createFoodCategoryQuery, queryVariablesCreateFoodCategory, headers);
      return true
  } catch (error) {
      console.error('Error adding FoodCategory:', error);
      return false
  }
}

// Function to update an activity
async function updateActivity(user, activityId, updateData) {
  if (!user) { return false}
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
      await request(GRAPHQL_ENDPOINT, updateActivityQuery, queryVariables, headers);
      return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

// Function to update an training
async function updateTraining(user, trainingId, updateData) {
  if (!user) { return false}
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
      await request(GRAPHQL_ENDPOINT, updateTrainingQuery, queryVariables, headers);
      return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

// Function to update Profile
async function updateProfile(user, profileId, updateData) {
  if (!user) { return false}
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update Profile
  const updateProfileQuery = gql`
      mutation UpdateProfile($profileId: ObjectId!, $updateData: ProfileUpdateInput!) {
          updateOneProfile(query: { _id: $profileId }, set: $updateData) {
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
            isRatioSelected
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

  const queryVariables = {
    profileId,
    updateData,
  };

  try {
      const resp = await request(GRAPHQL_ENDPOINT, updateProfileQuery, queryVariables, headers);
      return resp.updateOneProfile;
  } catch (error) {
      alert(error);
      return false;
  }
}

// Function to update an Food Category
async function updateFoodCategory(user, categoryId, updateData) {
  if (!user) { return false}

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an Food Category
  const updateFoodCategoryQuery = gql`
      mutation UpdateFoodCategory($categoryId: ObjectId!, $updateData: FoodCategoryUpdateInput!) {
          updateOneFoodCategory(query: { _id: $categoryId }, set: $updateData) {
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
      }
  `;

  const queryVariables = {
    categoryId,
    updateData,
  };

  try {
      await request(GRAPHQL_ENDPOINT, updateFoodCategoryQuery, queryVariables, headers);
      return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

// Function to update an Food Category
async function updateFood(user, foodId, updateData) {
  if (!user) { return false}

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an Food Category
  const updateFoodQuery = gql`
      mutation UpdateFood($foodId: ObjectId!, $updateData: FoodUpdateInput!) {
          updateOneFood(query: { _id: $foodId }, set: $updateData) {
              _id
              weight
          }
      }
  `;

  const queryVariables = {
    foodId,
    updateData,
  };

  try {
      await request(GRAPHQL_ENDPOINT, updateFoodQuery, queryVariables, headers);
      return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

// Function to update an Foof Template
async function updateFoodTemplate(user, foodItem) {
  if (!user) { return false}

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const templateId = foodItem._id
  const userId = user.id
  
  // GraphQL query to update Food Template
  const updateFoodTemplateQuery = gql`
      mutation UpdateActivity($templateId: ObjectId!, $updateData: FoodTemplateUpdateInput!) {
          updateOneFoodTemplate(query: { _id: $templateId }, set: $updateData) {
            _id
            ash
            bonesRatio
            calories
            caloriesServing
            carb
            categoryType
            desc
            fat
            fiber
            image
            isCustom
            meatRatio
            name
            protein
            servingWeight
            servings
            type
            units
            userId
            weight
          }
      }
  `;

  const queryVariables = {
      templateId,
      updateData: {
        bonesRatio:  foodItem.bonesRatio,
        categoryType: foodItem.categoryType,
        calories:  foodItem.calories,
        caloriesServing:  foodItem.caloriesServing,
        image: "",
        meatRatio:  foodItem.meatRatio,
        name:  foodItem.name,
        servingWeight:  foodItem.servingWeight,
        servings: foodItem.servings,
        type:  foodItem.type,
        units: foodItem.units, 
        weight: 0,
        ash: foodItem.ash,
        desc: foodItem.desc,
        fat: foodItem.fat,
        fiber: foodItem.fiber,
        protein: foodItem.protein,
        carb: foodItem.carb,
        isCustom: true,
        userId: userId
      }
  };

  try {
      await request(GRAPHQL_ENDPOINT, updateFoodTemplateQuery, queryVariables, headers)
      return true;
  } catch (error) {
      alert(error);
      return false;
  }
}

export { 
    searchForFood, 
    getAllFoodForMeal, 
    getAllCustomFoodTemplates,
    getAllFoodTemplatesForCategory,
    getAllFoodCategories,
    deleteFoodCategory,
    deleteMeal,
    deleteActivity,
    deleteTraining,
    deleteFood,
    deleteFoodTemplate,
    getUserProfiles,
    loadMeals,
    loadFood,
    loadActivities,
    loadTrainings,
    addMeal,
    addActivity,
    addTraining,
    addFood, 
    addFoodCategory,
    addFoodTemplate,
    updateActivity,
    updateTraining,
    updateProfile,
    updateFoodTemplate,
    updateFoodCategory,
    updateFood,

};