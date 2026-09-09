/**
 * GraphQL Queries
 */

import { gql } from 'graphql-request';

// FOOD QUERIES

export const SEARCH_FOOD_TEMPLATE = gql`
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

export const GET_ALL_FOOD_FOR_MEAL = gql`
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

export const GET_FOOD_FOR_PERIOD = gql`
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

export const GET_ALL_FOOD = gql`
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

export const GET_ALL_CUSTOM_FOOD_TEMPLATES = gql`
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

export const GET_ALL_FOOD_TEMPLATES_FOR_CATEGORY = gql`
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

export const GET_ALL_FOOD_CATEGORIES = gql`
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

// MEAL QUERIES

export const GET_ALL_MEALS = gql`
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

// ACTIVITY QUERIES

export const GET_ACTIVITIES_FOR_PERIOD = gql`
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

export const GET_ALL_ACTIVITIES = gql`
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

// TRAINING QUERIES

export const GET_TRAININGS_FOR_PERIOD = gql`
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

export const GET_ALL_TRAININGS = gql`
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

// PROFILE QUERIES

export const GET_PROFILES = gql`
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

export const GET_FOOD_TEMPLATE_BY_ID = gql`
  query getFoodTemplateById($id: ObjectId!) {
    foodTemplate(query: { _id: $id }) {
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

export const GET_FOOD_BY_ID = gql`
  query getFoodById($id: ObjectId!) {
    food(query: { _id: $id }) {
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
