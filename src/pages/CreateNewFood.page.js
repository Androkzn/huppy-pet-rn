/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import { gql, request } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import NewFoodForm from "../components/NewFoodForm.component";
import { useNavigate } from "react-router-dom";
import {BackButton} from '../components/Shared.components'

const CreateNewFood = ({ mealId, profileId, userId, accessToken, loadFoodForMeal }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Some prefilled form state
  const [form, setForm] = useState({
    name: "",
    type: "",
    units: "",
    category: "",
    protein: 0,
    fat: 0,
    fiber: 0,
    ash: 0,
    carb: 0,
    calories: 0,
    servings: 0,
    caloriesServing: 0,
    servingWeight: 0,
    meatRatio: 0,
    bonesRatio: 0,
    description: "",
  });

  // addFood function is responsible for adding the food
  const addFood = async () => {
    const headers = { Authorization: `Bearer ${accessToken}` };
   
    // GraphQL query to create food
    const createFoodQuery = gql`
    mutation AddFood($data: FoodInsertInput!) {
      insertOneFood(data: $data) {
        _id
      }
    }
    `;

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

    try {
      await request(GRAPHQL_ENDPOINT, createFoodQuery, queryVariablesCreateFood, headers);
      loadFoodForMeal();
    } catch (error) {
      alert(error);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(form)
    const { name, calories} = form;
    if ( name.length === 0 || calories  === 0   ) {
      return;
    }
    addFood()
  };

  return <PageContainer>
    <BackButton text="Back" onClick={navigate(`/`)}/>
    <NewFoodForm onSubmit={onSubmit} form={form} setForm={setForm} title="Add Food" />
  </PageContainer>
}

export default CreateNewFood;