/**
 * GraphQL Mutations
 */

import { gql } from 'graphql-request';

// FOOD MUTATIONS

export const ADD_FOOD = gql`
  mutation AddFood($data: FoodInsertInput!) {
    insertOneFood(data: $data) {
      _id
    }
  }
`;

export const UPDATE_FOOD = gql`
  mutation UpdateFood($foodId: ObjectId!, $updateData: FoodUpdateInput!) {
    updateOneFood(query: { _id: $foodId }, set: $updateData) {
      _id
      weight
    }
  }
`;

export const DELETE_FOOD = gql`
  mutation DeleteFood($query: FoodQueryInput!) {
    deleteOneFood(query: $query) {
      _id
    }
  }
`;

// FOOD TEMPLATE MUTATIONS

export const ADD_FOOD_TEMPLATE = gql`
  mutation AddFoodTemplate($data: FoodTemplateInsertInput!) {
    insertOneFoodTemplate(data: $data) {
      _id
    }
  }
`;

export const UPDATE_FOOD_TEMPLATE = gql`
  mutation UpdateFoodTemplate(
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

export const DELETE_FOOD_TEMPLATE = gql`
  mutation DeleteFoodTemplate($query: FoodTemplateQueryInput!) {
    deleteOneFoodTemplate(query: $query) {
      _id
    }
  }
`;

// MEAL MUTATIONS

export const ADD_MEAL = gql`
  mutation AddMeal($data: MealInsertInput!) {
    insertOneMeal(data: $data) {
      _id
    }
  }
`;

export const DELETE_MEAL = gql`
  mutation DeleteMeal($query: MealQueryInput!) {
    deleteOneMeal(query: $query) {
      _id
    }
  }
`;

// ACTIVITY MUTATIONS

export const ADD_ACTIVITY = gql`
  mutation AddActivity($data: ActivityInsertInput!) {
    insertOneActivity(data: $data) {
      _id
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
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

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($query: ActivityQueryInput!) {
    deleteOneActivity(query: $query) {
      _id
    }
  }
`;

// TRAINING MUTATIONS

export const ADD_TRAINING = gql`
  mutation AddTraining($data: TrainingInsertInput!) {
    insertOneTraining(data: $data) {
      _id
    }
  }
`;

export const UPDATE_TRAINING = gql`
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

export const DELETE_TRAINING = gql`
  mutation DeleteTraining($query: TrainingQueryInput!) {
    deleteOneTraining(query: $query) {
      _id
    }
  }
`;

// PROFILE MUTATIONS

export const ADD_PROFILE = gql`
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

export const UPDATE_PROFILE = gql`
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

export const DELETE_PROFILE = gql`
  mutation DeleteProfile($query: ProfileQueryInput!) {
    deleteOneProfile(query: $query) {
      _id
    }
  }
`;

// FOOD CATEGORY MUTATIONS

export const ADD_FOOD_CATEGORY = gql`
  mutation AddFoodCategory($data: FoodCategoryInsertInput!) {
    insertOneFoodCategory(data: $data) {
      _id
    }
  }
`;

export const UPDATE_FOOD_CATEGORY = gql`
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

export const DELETE_FOOD_CATEGORY = gql`
  mutation DeleteFoodCategory($query: FoodCategoryQueryInput!) {
    deleteOneFoodCategory(query: $query) {
      _id
    }
  }
`;
