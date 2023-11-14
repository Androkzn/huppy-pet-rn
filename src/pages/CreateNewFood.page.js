/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import PageContainer from "../components/PageContainer.component";
import { UserContext } from "../contexts/user.context";
import NewFoodForm from "../components/NewFoodForm.component";
import { useNavigate } from "react-router-dom";
import {BackButton} from '../components/Shared.components'
import { addFood } from "../graphql/graphqlUtils";

const CreateNewFood = ({ mealId, loadFoodForMeal }) => {
  const { user, currentProfile } = useContext(UserContext);
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

  // addFood function is responsible for adding the Food
  const addNewFood = async () => {
    const isAdded = await addFood(user, currentProfile, mealId, form)  
    if (isAdded) {
      loadFoodForMeal();
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(form)
    const { name, calories} = form;
    if ( name.length === 0 || calories  === 0   ) {
      return;
    }
    addNewFood()
  };

  return <PageContainer>
    <BackButton text="Back" onClick={navigate(`/`)}/>
    <NewFoodForm onSubmit={onSubmit} form={form} setForm={setForm} title="Add Food" />
  </PageContainer>
}

export default CreateNewFood;