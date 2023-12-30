import request, { gql } from 'graphql-request';
import {
  getStartAndEndOfToday,
  getStartAndEndOfWeek,
  getEndOfDay,
  getStartOfDay,
} from '../helpers/Date.helper';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT;

const refreshAccessToken = async (user) => {
  try {
    // Refresh the access token
    await user.refreshAccessToken();
    console.log('Refreshed token:', user._accessToken);
    return user._accessToken;
  } catch (error) {
    // Handle the refresh error
    console.error('Error refreshing access token:', error);
    throw error; // Rethrow the error for the calling function to handle
  }
};

// Func that is responsible for searching Food Templates in DB
// it return array of FoodTemplates based on search string
const searchForFood = async (searchQuery, user) => {
  if (!user || user._accessToken === null) {
    return [];
  }
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
    const resp = await request(
      GRAPHQL_ENDPOINT,
      searchFoodTemplateQuery,
      queryVariables,
      headers
    );
    if (resp.search) {
      return resp.search;
    }
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      searchForFood(searchQuery, user);
      console.error('InvalidSession', error);
    } else {
      console.error('Error search for food', error);
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
const getAllFoodForMeal = async (user, currentProfile, mealId) => {
  if (!user || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllFoodForMeal = gql`
    query getAllFoodForMeal($mealId: String!, $profileId: String!) {
      foods(query: { mealId: $mealId, profileId: $profileId }) {
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
        profileId
      }
    }
  `;
  const queryVariables = {
    mealId: mealId,
    profileId: profileId,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllFoodForMeal,
      queryVariables,
      headers
    );
    // Update the 'food' state with the fetched data
    return resp.foods;
  } catch (error) {
    if (
      error.response.error_code === 'InvalidSession' ||
      error.response?.status === 401
    ) {
      console.error('InvalidSession', error);
      await refreshAccessToken(user);
      getAllFoodForMeal(user, mealId);
    } else {
      console.error('Error fetching food for meal', error);
    }
    throw error;
    return [];
  }
};

// Func that is responsible for fetching  all food for specific time period
const getFoodForPeriod = async (user, currentProfile, startTime, endTime) => {
  if (!user || user._accessToken === null) {
    return [];
  }

  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all food for a specific time period and profileId
  const getFoodForPeriod = gql`
    query getFoodForPeriod(
      $userId: String!
      $profileId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      foods(
        query: {
          userId: $userId
          profileId: $profileId
          date_gte: $startDate
          date_lte: $endDate
        }
      ) {
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

  const startISOString = getStartOfDay(startTime);
  const endISOString = getEndOfDay(endTime);

  // Filter only current user with current profile
  const queryVariables = {
    userId: userId,
    profileId: profileId,
    startDate: startISOString,
    endDate: endISOString,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getFoodForPeriod,
      queryVariables,
      headers
    );
    // Update the 'food' state with the fetched data
    return resp.foods;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getFoodForPeriod(user, startTime, endTime, profileId);
    } else {
      console.error(
        'Error fetching food for the time period and profileId',
        error
      );
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific time period
const getActivitiesForPeriod = async (
  user,
  currentProfile,
  startTime,
  endTime
) => {
  if (!user || user._accessToken === null) {
    return [];
  }

  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all activities for a specific time period and profileId
  const getActivitiesForPeriod = gql`
    query getActivitiesForPeriod(
      $userId: String!
      $profileId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      activities(
        query: {
          userId: $userId
          profileId: $profileId
          date_gte: $startDate
          date_lte: $endDate
        }
      ) {
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
  const startISOString = getStartOfDay(startTime);
  const endISOString = getEndOfDay(endTime);

  // Filter only current user with current profile
  const queryVariables = {
    userId: userId,
    profileId: profileId,
    startDate: startISOString,
    endDate: endISOString,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getActivitiesForPeriod,
      queryVariables,
      headers
    );
    return resp.activities;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getActivitiesForPeriod(user, startTime, endTime, profileId);
    } else {
      console.error(
        'Error fetching food for the time period and profileId',
        error
      );
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific time period
const getTrainingsForPeriod = async (
  user,
  currentProfile,
  startTime,
  endTime
) => {
  if (!user || user._accessToken === null) {
    return [];
  }

  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all trainings for a specific time period and profileId
  const getTrainingsForPeriod = gql`
    query getTrainingsForPeriod(
      $userId: String!
      $profileId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      trainings(
        query: {
          userId: $userId
          profileId: $profileId
          date_gte: $startDate
          date_lte: $endDate
        }
      ) {
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
  const startISOString = getStartOfDay(startTime);
  const endISOString = getEndOfDay(endTime);

  // Filter only current user with current profile
  const queryVariables = {
    userId: userId,
    profileId: profileId,
    startDate: startISOString,
    endDate: endISOString,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getTrainingsForPeriod,
      queryVariables,
      headers
    );

    return resp.trainings;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getFoodForPeriod(user, startTime, endTime, profileId);
      console.error('InvalidSession', error);
    } else {
      console.error(
        'Error fetching food for the time period and profileId',
        error
      );
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
const getAllCustomFoodTemplates = async (user) => {
  if (!user || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllCustomFoodTemplates = gql`
    query getAllCustomFoodTemplates {
      foodTemplates(query: { isCustom: true }) {
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
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllCustomFoodTemplates,
      queryVariables,
      headers
    );
    // Update the 'food' state with the fetched data
    return resp.foodTemplates;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getAllCustomFoodTemplates(user);
      console.error('InvalidSession', error);
    } else {
      console.error('Error get All Custom Food Templates', error);
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
const getAllFoodTemplatesForCategory = async (user, categoryType) => {
  if (!user || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllFoodTemplatesForCategory = gql`
    query getAllFoodTemplatesForCategory($categoryType: String!) {
      foodTemplates(query: { categoryType: $categoryType }) {
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
    categoryType: categoryType.toLowerCase(),
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllFoodTemplatesForCategory,
      queryVariables,
      headers
    );

    // Update the 'food' state with the fetched data
    return resp.foodTemplates;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getAllFoodTemplatesForCategory(user, categoryType);
      console.error('InvalidSession', error);
    } else {
      console.error(
        'Error get All Custom Food Templates for category: ',
        error
      );
    }

    return [];
  }
};

// Func that is responsible for fetching  all food for specific meal
// it returna array of Food
const getAllFoodCategories = async (user, profileId) => {
  if (!user || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to fetch all  food for specificmeal
  const getAllFoodCategories = gql`
    query getAllFoodCategories($profileId: String!) {
      foodCategories(query: { profileId: $profileId }) {
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
    profileId: profileId,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllFoodCategories,
      queryVariables,
      headers
    );
    // Update the 'food' state with the fetched data
    return resp.foodCategories;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getAllFoodCategories(user, profileId);
      console.error('InvalidSession', error);
    } else {
      console.error('Error get All Food Categories', error);
    }
    return [];
  }
};

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
const deleteMeal = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
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

  try {
    await request(GRAPHQL_ENDPOINT, deleteMealQuery, queryVariables, headers);
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteMeal(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting meal', error);
    }

    return false;
  }
};

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
const deleteActivity = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
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

  try {
    await request(
      GRAPHQL_ENDPOINT,
      deleteActivityQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteActivity(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting activity', error);
    }

    return false;
  }
};

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
const deleteTraining = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
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

  try {
    await request(
      GRAPHQL_ENDPOINT,
      deleteTrainingQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteTraining(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting training', error);
    }

    return false;
  }
};

// Func that is responsible for deleting a meal based on the expense-id
// it return bool value
const deleteFood = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
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
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteFood(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting food', error);
    }
    return false;
  }
};

// Func that is responsible for deleting a food template based on the expense-id
// it return bool value
const deleteFoodTemplate = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

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
    await request(
      GRAPHQL_ENDPOINT,
      deleteFoodTemplateQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteFoodTemplate(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting food template', error);
    }

    return false;
  }
};

// Func that is responsible for deleting a food template based on the expense-id
// it return bool value
const deleteFoodCategory = async ({ user, _id }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to delete an food template
  const deleteFoodCategoryQuery = gql`
    mutation DeleteFoodCategory($query: FoodCategoryQueryInput!) {
      deleteOneFoodCategory(query: $query) {
        _id
      }
    }
  `;

  const queryVariables = { query: { _id } };

  try {
    await request(
      GRAPHQL_ENDPOINT,
      deleteFoodCategoryQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      deleteFoodCategory(user, _id);
      console.error('InvalidSession', error);
    } else {
      console.error('Error deleting food category', error);
    }
    return false;
  }
};

// Func that is responsible for adding Food to DB
// it return bool value
const addFood = async ({
  user,
  mealId,
  currentProfile,
  foodItem,
  selectedDate,
}) => {
  if (!user || user._accessToken === null) {
    return false;
  }

  const accessToken = user._accessToken;
  const userId = user.id;
  const profileId = currentProfile._id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  // All the data that needs to be sent to the GraphQL endpoint
  // to create food will be passed through queryVariablesCreateFood.

  const queryVariablesCreateFood = {
    data: {
      bonesRatio: foodItem.bonesRatio,
      categoryType: foodItem.categoryType,
      calories: foodItem.calories,
      caloriesServing: foodItem.caloriesServing,
      image: foodItem.image,
      mealId: mealId,
      meatRatio: foodItem.meatRatio,
      name: foodItem.name,
      servingWeight: foodItem.servingWeight,
      servings: foodItem.servings,
      templateId: foodItem._id,
      type: foodItem.type,
      units: foodItem.units,
      weight: foodItem.weight,
      userId: userId,
      profileId: profileId,
      date: selectedDate,
    },
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
    await request(
      GRAPHQL_ENDPOINT,
      createFoodQuery,
      queryVariablesCreateFood,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addFood(user, mealId, foodItem, selectedDate);
      console.error('InvalidSession', error);
    } else {
      console.error('Error add food', error);
    }
    return false;
  }
};

// Func that is responsible for adding FoodTemplate to DB
// it return bool value
const addFoodTemplate = async ({ user, foodItem }) => {
  if (!user || user._accessToken === null) {
    return { success: false, templateId: '' };
  }
  const accessToken = user._accessToken;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  // All the data that needs to be sent to the GraphQL endpoint
  // to create food will be passed through queryVariablesCreateFood.

  const queryVariablesCreateFood = {
    data: {
      bonesRatio: foodItem.bonesRatio,
      categoryType: foodItem.categoryType,
      calories: foodItem.calories,
      caloriesServing: foodItem.caloriesServing,
      image: foodItem.image,
      meatRatio: foodItem.meatRatio,
      name: foodItem.name,
      servingWeight: foodItem.servingWeight,
      servings: foodItem.servings,
      type: foodItem.type,
      units: foodItem.units,
      weight: 0,
      ash: foodItem.ash,
      desc: foodItem.desc,
      fat: foodItem.fat,
      fiber: foodItem.fiber,
      protein: foodItem.protein,
      carb: foodItem.carb,
      isCustom: true,
      userId: userId,
    },
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
    const response = await request(
      GRAPHQL_ENDPOINT,
      createFoodQuery,
      queryVariablesCreateFood,
      headers
    );
    // Extract the _id from the response
    const templateId = response.insertOneFoodTemplate._id;
    return { success: true, templateId: templateId };
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addFoodTemplate(user, foodItem);
      console.error('InvalidSession', error);
    } else {
      console.error('Error add food template', error);
    }
    return { success: false, templateId: '' };
  }
};

// Func that is responsible for fetching  all all profiles for specific user
// it returna arrayprofiles and current profile
const getUserProfiles = async (user) => {
  if (!user || user._accessToken === null) {
    return [];
  }

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const userId = user.id;

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
    userId: userId,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getProfiles,
      queryVariablesProfiles,
      headers
    );
    const profiles = resp.profiles.map((profile) => ({
      ...profile,
      key: profile._id,
    }));
    return profiles;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getUserProfiles(user);
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading profiles:', error);
    }

    return [];
  }
};

// Func that is responsible for fetching  all all profiles for specific user
// it returna arrayprofiles and current profile
const getCurrentProfile = async (user) => {
  if (!user || user._accessToken === null) {
    return null;
  }

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const userId = user.id;

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
    userId: userId,
    isCurrent: true,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getProfiles,
      queryVariablesProfiles,
      headers
    );
    const currentProfileFetched = resp.profiles.filter(
      (profile) => profile.isCurrent === true
    );
    const currentProfile = currentProfileFetched[0];
    return currentProfile;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getUserProfiles(user);
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading profiles:', error);
    }

    return null;
  }
};

// Func that is responsible for adding FoodTemplate to DB
// it return bool value
const addProfile = async ({ user, profile }) => {
  if (!user || user._accessToken === null) {
    return null;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

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
      name: profile.name,
      activityType: profile.activityType,
      avatar: profile.avatar,
      breed: profile.breed,
      dailyPortion: profile.dailyPortion,
      dailyRatio: profile.dailyRatio,
      weight: profile.weight,
      deductCalories: profile.deductCalories,
      dob: profile.dob,
      isCurrent: profile.isCurrent,
      preset: profile.preset,
      size: profile.size,
      userId: user.id,
      isRatioSelected: profile.isRatioSelected,
    },
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      createProfileQuery,
      queryVariablesCreateProfile,
      headers
    );
    const profileNew = resp.insertOneProfile;
    return profileNew;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      getUserProfiles(user);
      console.error('InvalidSession', error);
    } else {
      console.error('Error creating profile:', error);
    }

    return null;
  }
};

const loadMeals = async (user, currentProfile, currentDate, isToday = true) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = isToday
    ? getStartAndEndOfToday(currentDate)
    : getStartAndEndOfWeek(currentDate);

  // GraphQL query to fetch all the meals for specific time interval
  const getAllMeals = gql`
    query getAllMeals(
      $userId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      meals(
        query: { userId: $userId, date_gte: $startDate, date_lte: $endDate }
      ) {
        _id
        date
        profileId
        userId
      }
    }
  `;

  // Filter only current user with current profile
  const queryVariables = {
    userId: userId,
    profileId: profileId,
    startDate: start,
    endDate: end,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllMeals,
      queryVariables,
      headers
    );
    const meals = resp.meals.map((meal) => ({ ...meal, key: meal._id }));
    if (meals) {
      return meals;
    } else {
      return [];
    }
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      loadMeals(user, currentProfile, currentDate, (isToday = true));
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading meals:', error);
    }

    return [];
  }
};

const loadFood = async (user, currentProfile, currentDate, isToday) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = isToday
    ? getStartAndEndOfToday(currentDate)
    : getStartAndEndOfWeek(currentDate);

  // GraphQL query to fetch all the meals for specific time interval
  const getAllFood = gql`
    query getAllFood(
      $userId: String!
      $profileId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      foods(
        query: {
          userId: $userId
          profileId: $profileId
          date_gte: $startDate
          date_lte: $endDate
        }
      ) {
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
        profileId
      }
    }
  `;

  // Filter only current user with current profile
  const queryVariables = {
    userId: userId,
    profileId: profileId,
    startDate: start,
    endDate: end,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllFood,
      queryVariables,
      headers
    );
    const food = resp.foods.map((food) => ({ ...food, key: food._id }));
    return food;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      loadFood(user, currentProfile, currentDate, isToday);
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading food:', error);
    }

    return [];
  }
};

const loadActivities = async (user, currentProfile, currentDate) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = getStartAndEndOfToday(currentDate);

  // GraphQL query to fetch all the activities for specific time interval
  const getAllActivities = gql`
    query getAllActivities(
      $userId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      activities(
        query: { userId: $userId, date_gte: $startDate, date_lte: $endDate }
      ) {
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
    userId: userId,
    profileId: profileId,
    startDate: start,
    endDate: end,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllActivities,
      queryVariables,
      headers
    );
    const activities = resp.activities.map((activity) => ({
      ...activity,
      key: activity._id,
    }));
    return activities;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      loadActivities(user, currentProfile, currentDate);
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading Activities:', error);
    }

    return [];
  }
};

const loadTrainings = async (user, currentProfile, currentDate) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return [];
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const { start, end } = getStartAndEndOfToday(currentDate);

  // GraphQL query to fetch all the trainings for specific time interval
  const getAllTrainings = gql`
    query getAllTrainings(
      $userId: String!
      $profileId: String!
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      trainings(
        query: {
          userId: $userId
          profileId: $profileId
          date_gte: $startDate
          date_lte: $endDate
        }
      ) {
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
    userId: userId,
    profileId: profileId,
    startDate: start,
    endDate: end,
  };

  try {
    const resp = await request(
      GRAPHQL_ENDPOINT,
      getAllTrainings,
      queryVariables,
      headers
    );
    const trainings = resp.trainings.map((training) => ({
      ...training,
      key: training._id,
    }));
    return trainings;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      loadTrainings(user, currentProfile, currentDate);
      console.error('InvalidSession', error);
    } else {
      console.error('Error loading trainings:', error);
    }

    return [];
  }
};

const addMeal = async ({ user, currentProfile, currentDate }) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
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
      date: currentDate,
      profileId: profileId,
      userId: userId,
    },
  };

  try {
    const result = await request(
      GRAPHQL_ENDPOINT,
      createMealQuery,
      queryVariablesCreateMeal,
      headers
    );
    return result.insertOneMeal._id;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addMeal(user, currentProfile, currentDate);
      console.error('InvalidSession', error);
    } else {
      console.error('Error adding meal:', error);
    }

    return false;
  }
};

const addActivity = async ({ user, currentProfile, selectedDate, data }) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
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
      userId: userId,
    },
  };

  try {
    await request(
      GRAPHQL_ENDPOINT,
      createActivityQuery,
      queryVariablesCreateActivity,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addActivity(user, currentProfile, selectedDate, data);
      console.error('InvalidSession', error);
    } else {
      console.error('Error adding activity:', error);
    }

    return false;
  }
};

const addTraining = async ({ user, currentProfile, selectedDate, data }) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
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
      userId: userId,
    },
  };

  try {
    await request(
      GRAPHQL_ENDPOINT,
      createTrainingQuery,
      queryVariablesCreateTraining,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addTraining(user, currentProfile, selectedDate, data);
      console.error('InvalidSession', error);
    } else {
      console.error('Error adding training:', error);
    }

    return false;
  }
};

const addFoodCategory = async ({ user, currentProfile, data }) => {
  if (!user || !currentProfile || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const profileId = currentProfile._id;
  const userId = user.id;
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
      userId: userId,
    },
  };

  try {
    await request(
      GRAPHQL_ENDPOINT,
      createFoodCategoryQuery,
      queryVariablesCreateFoodCategory,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      addFoodCategory(user, currentProfile, data);
      console.error('InvalidSession', error);
    } else {
      console.error('Error adding Food Category:', error);
    }

    return false;
  }
};

// Function to update an activity
const updateActivity = async ({ user, activityId, updateData }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an activity
  const updateActivityQuery = gql`
    mutation UpdateActivity(
      $activityId: ObjectId!
      $updateData: ActivityUpdateInput!
    ) {
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
    await request(
      GRAPHQL_ENDPOINT,
      updateActivityQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateActivity(user, activityId, updateData);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update activity', error);
    }
    return false;
  }
};

// Function to update an training
const updateTraining = async ({ user, trainingId, updateData }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an training
  const updateTrainingQuery = gql`
    mutation UpdateTraining(
      $trainingId: ObjectId!
      $updateData: TrainingUpdateInput!
    ) {
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
    await request(
      GRAPHQL_ENDPOINT,
      updateTrainingQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateTraining(user, trainingId, updateData);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update training', error);
    }
    return false;
  }
};

// Function to update Profile
const updateProfile = async ({ user, profileId, updateData }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update Profile
  const updateProfileQuery = gql`
    mutation UpdateProfile(
      $profileId: ObjectId!
      $updateData: ProfileUpdateInput!
    ) {
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
    const resp = await request(
      GRAPHQL_ENDPOINT,
      updateProfileQuery,
      queryVariables,
      headers
    );
    return resp.updateOneProfile;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateProfile(user, profileId, updateData);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update profile', error);
    }
    return false;
  }
};

// Function to update an Food Category
const updateFoodCategory = async ({ user, categoryId, updateData }) => {
  if (!user || user._accessToken === null) {
    return false;
  }
  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };

  // GraphQL query to update an Food Category
  const updateFoodCategoryQuery = gql`
    mutation UpdateFoodCategory(
      $categoryId: ObjectId!
      $updateData: FoodCategoryUpdateInput!
    ) {
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
    await request(
      GRAPHQL_ENDPOINT,
      updateFoodCategoryQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateFoodCategory(user, categoryId, updateData);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update food category', error);
    }
    return false;
  }
};

// Function to update an Food Category
const updateFood = async ({ user, foodId, updateData }) => {
  if (!user || user._accessToken === null) {
    return false;
  }

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
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateFood(user, foodId, updateData);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update food', error);
    }
    return false;
  }
};

// Function to update an Foof Template
const updateFoodTemplate = async ({ user, foodItem }) => {
  if (!user || user._accessToken === null) {
    return false;
  }

  const accessToken = user._accessToken;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const templateId = foodItem._id;
  const userId = user.id;

  // GraphQL query to update Food Template
  const updateFoodTemplateQuery = gql`
    mutation UpdateActivity(
      $templateId: ObjectId!
      $updateData: FoodTemplateUpdateInput!
    ) {
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
      bonesRatio: foodItem.bonesRatio,
      categoryType: foodItem.categoryType,
      calories: foodItem.calories,
      caloriesServing: foodItem.caloriesServing,
      image: foodItem.image,
      meatRatio: foodItem.meatRatio,
      name: foodItem.name,
      servingWeight: foodItem.servingWeight,
      servings: foodItem.servings,
      type: foodItem.type,
      units: foodItem.units,
      weight: 0,
      ash: foodItem.ash,
      desc: foodItem.desc,
      fat: foodItem.fat,
      fiber: foodItem.fiber,
      protein: foodItem.protein,
      carb: foodItem.carb,
      isCustom: true,
      userId: userId,
    },
  };

  try {
    const result = await request(
      GRAPHQL_ENDPOINT,
      updateFoodTemplateQuery,
      queryVariables,
      headers
    );
    return true;
  } catch (error) {
    if (error.response.error_code === 'InvalidSession') {
      await refreshAccessToken(user);
      updateFoodTemplate(user, foodItem);
      console.error('InvalidSession', error);
    } else {
      console.error('Error update food template', error);
    }
    return false;
  }
};

export {
  searchForFood,
  getAllFoodForMeal,
  getAllCustomFoodTemplates,
  getAllFoodTemplatesForCategory,
  getFoodForPeriod,
  getActivitiesForPeriod,
  getTrainingsForPeriod,
  getAllFoodCategories,
  deleteFoodCategory,
  deleteMeal,
  deleteActivity,
  deleteTraining,
  deleteFood,
  deleteFoodTemplate,
  getUserProfiles,
  getCurrentProfile,
  loadMeals,
  loadFood,
  loadActivities,
  loadTrainings,
  addMeal,
  addActivity,
  addTraining,
  addFood,
  addProfile,
  addFoodCategory,
  addFoodTemplate,
  updateActivity,
  updateTraining,
  updateProfile,
  updateFoodTemplate,
  updateFoodCategory,
  updateFood,
};
