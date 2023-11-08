/** @jsxImportSource @emotion/react */

import request, { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import { GRAPHQL_ENDPOINT } from "../realm/constants";
import PageContainer from "../components/PageContainer.component";
import * as enums from "../helpers/Enums"
import { css } from "@emotion/react";
//import AddFoodPage from "./AddFood.page"; // Import the AddFood.page for opening when an item is clicked

const SearchFood = () => {
const { user } = useContext(UserContext);
    const userId = user.id;
    const accessToken = user._accessToken;

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [searchResult, setResults] = useState([]);

  //let searchResult = [];
 

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    console.log("Opening AddFoodPage for:", foodItem);
  };

    // GraphQL query to fetch all  food for specificmeal
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
  
    useEffect(() => {
      //Do not query an empty string
      if( searchQuery.length > 0 )  {
          searchFood(); // Load food data when the component mounts
      }
    }, [searchQuery]); // Empty dependency array to ensure it runs only once on mount
  
    async function searchFood() {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const resp = await request(GRAPHQL_ENDPOINT, searchFoodQuery, queryVariables, headers);
       
        // Update the 'food' state with the fetched data
        if( resp.search)  {
          setResults(resp.search);
        }
       
      } catch (error) {
        alert(error);
      }
    }
 
    const FilterContainer = ({ selectedCategory, setSelectedCategory }) => {
      const filterOptions = [
        "All",
        "Filter by category",
        "My food",
        "My Recipe",
      ];
    
      const [selectedOption, setSelectedOption] = useState("All");
    
      const handleOptionChange = (option) => {
        setSelectedOption(option);
    
        if (option === "Filter by category") {
          setSelectedCategory("dropdown"); // Set to "dropdown" when "Filter by category" is selected
        } else {
          setSelectedCategory(option);
        }
      };
    
      return (
        <div>
          {filterOptions.map((option) => (
            <label
              key={option}
              css={css`
                display: inline-block;
                margin-right: 10px;
                cursor: pointer;
              `}
            >
              <input
                type="radio"
                name="categoryOption"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
              />
              {option === "Filter by category" ? (
                <span>
                  Filter by category <select>
                    <option>Dropdown Option 1</option>
                    <option>Dropdown Option 2</option>
                    <option>Dropdown Option 3</option>
                  </select>
                </span>
              ) : (
                option
              )}
            </label>
          ))}
        </div>
      );
    };
    
    

  const ResultContainer = ({ searchResult, openAddFoodPage }) => {
    return (
      <div>
        {searchResult.map((foodItem, index) => (
          <div key={index}>
            <div>
              <span>{foodItem.name}</span>
              {foodItem.custom && <span>Custom</span>}
            </div>
            <button onClick={() => openAddFoodPage(foodItem)}>Open AddFoodPage</button>
          </div>
        ))}
      </div>
    );
  };

  return <PageContainer>
      <h1>Search Food</h1>
      <label htmlFor="searchField">Search for food:</label>
        <input
        type="text"
        id="searchField"  // Add an id attribute
        placeholder="Search for food"
        value={searchQuery}
        onChange={(e) => {
            if (searchQuery !== e.target.value) {
                setSearchQuery(e.target.value);
                //searchFood();
            }
        }}
        />
      <FilterContainer
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ResultContainer
        searchResult={searchResult}
        openAddFoodPage={openAddFoodPage}
      />
    </PageContainer>
  
}

export default SearchFood;
