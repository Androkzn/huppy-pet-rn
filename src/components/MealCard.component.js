import { Delete, Edit } from "@mui/icons-material";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import request, { gql } from "graphql-request";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";

const MealsCard = ({ _id, title, amount, category, mode, createdAt, afterDelete }) => {
  const { user } = useContext(UserContext);

  // GraphQL query to delete an Meal
  const deleteMealQuery = gql`
  mutation DeleteMeal($query: MealQueryInput!) {
    deleteOneMeal(query: $query) {
      _id
    }
  }
  `;

  // Passing the Meal-id in the query to delete a specific Meal
  const queryVariables = { query: { _id } };

  const headers = { Authorization: `Bearer ${user._accessToken}` };

  // deleteThisMeal function is responsible for deleting the
  // Meal based on the Meal-id provided and then calling the
  // afterDelete function to do the cleanup. 
  const deleteThisMeal = async () => {

    // Confirming the user's action
    const resp = window.confirm("Are you sure you want to delete this Meal?");
    if (!resp) return;

    try {
      await request(GRAPHQL_ENDPOINT, deleteMealQuery, queryVariables, headers);
      afterDelete();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Card style={{ marginBottom: "1rem", paddingBottom: 0 }} elevation={1}>
      <CardContent>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant='body2' color="text.secondary" gutterBottom>
              {category}
            </Typography>
            <Typography variant="h6" component={Link} to={`/expense/${_id}`}>
              {title}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              ₹{amount}/-
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {mode}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Link to={`/expense/${_id}/edit`}>
              <IconButton color="primary">
                <Edit />
              </IconButton>
            </Link>
            <IconButton color="error" onClick={deleteThisMeal}>
              <Delete />
            </IconButton>
            <Typography variant="body1" color="text.secondary">
              {(new Date(createdAt)).toDateString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default MealsCard;