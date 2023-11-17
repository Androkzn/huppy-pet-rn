/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import { getAllCustomFoodTemplates, getAllFoodTemplatesForCategory, searchForFood } from "../graphql/graphqlUtils";
import * as Enums from "../helpers/Enums.helper"
import FoodCard from "../components/FoodCard.component"
import * as styles from "../components/styles/SearchFood.css"
import {ButtonWithImage} from '../components/Buttons.components'
import { useNavigate, useLocation } from "react-router-dom";
import {Image} from '../components/Image.components'

const SearchFood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealId } = location.state || {};

  const { user } = useContext(UserContext);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState("meat");
   // State for searchResult 
  const [searchResult, setResults] = useState([]);
   // State for radio buttons 
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    navigate("/addFood", { state: { mealId, foodItem } });
  };

  const openCeateNewFoodPage = () => {
    navigate("/createNewFood", { state: { mealId } });
  };

  useEffect(() => {
    // Do not query an empty string if selected filter is "All"
    if (searchQuery.length > 0 || selectedFilter !== "All") {
      searchFood(); 
    } else {
      setResults([]);
    }
  }, [searchQuery, selectedFilter, selectedCategory]);

  // Func that is responsible for searching Food Templates in DB based on search string
  async function searchFood() {
    console.log("searchFood for:", selectedFilter);
    if (selectedFilter === "All") {
      const results = await searchForFood(searchQuery, user);
      setResults(results);
    } else if  (selectedFilter === "Filter by category") {
      const results = await getAllFoodTemplatesForCategory(user, selectedCategory)
      console.log("Filter by category results:", results);
      setResults(results);
    } else if  (selectedFilter === "My food") {
      const results = await getAllCustomFoodTemplates(user)
      console.log("My food results:", results);
      setResults(results);
    } else if  (selectedFilter === "My Recipe"){

    }
    console.log("searchFood results:", searchResult);
  }
 
    const FilterContainer = ({ selectedCategory, setSelectedCategory }) => {
      const filterOptions = [
        "All",
        "Filter by category",
        "My food",
        "My Recipe",
      ];
    
      async function handleCategoryChange(e) {
        const newValue = e.target.value;
        console.log("handleCategoryChange:", newValue);
        setSelectedCategory(newValue)
      }

      async function handleFilterChange(filter) {
        console.log("handleFilterChange:", filter);
        setSelectedFilter(filter)
      }
    
      return (
        <div style={styles.rowStyle}>
          {filterOptions.map((filter) => (
            <label key={filter} style={styles.labelFilterStyle}>
              <input
                style={styles.radioButtonStyle}
                type="radio"
                name="categoryOption"
                value={selectedFilter}  
                checked={selectedFilter === filter}
                onChange={() => handleFilterChange(filter)}
              />
              <span>{filter === "Filter by category" ? (
                <>
                  Filter by category
                  <select
                    style={styles.dropdownStyle}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedFilter("Filter by category");
                      handleCategoryChange(e)
                    }}
                  >
                    {Object.values(Enums.FoodCategoryType).map((type, index) => (
                      <option key={index} value={Enums.getTitleUpercased(type)}>
                        {Enums.getTitleUpercased(type)}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                filter
              )}</span>
            </label>
          ))}
        </div>
      );
      
    };
    
    
  const ResultContainer = ({ searchResult, openAddFoodPage }) => {
      // Check if searchResult is not defined or is an empty array
    if (!searchResult || searchResult.length === 0) {
      return <div style={styles.rowStyle}>
        {selectedFilter === "All" &&  searchQuery.length === 0 ? (
          <Image imageName="start_typing_placeholder.png" width="200" height="250"/>
          ) : (
            <Image imageName="no_results_placeholder.png" width="200" height="250"/>
        )}
        </div>;
    }

    return (
      <div>
        {searchResult.map((foodItem, index) => (
          <div key={index}>
              <FoodCard food={foodItem} openAddFoodPage={() => openAddFoodPage(foodItem)}/>
          </div>
        ))}
      </div>
    );
  };

  return <PageContainer>
    <div  style={styles.buttonsContainerStyle}>
    <ButtonWithImage
          variant="backButton"
          to="/"
          imageName="back_arrow.svg"
          imageSize={20}
        >
         Back
        </ButtonWithImage>
      <ButtonWithImage
          variant="addButton"
          width='180px'
          as='button'
          imageName="plus_round_fill_white_button.svg"
          imageSize={20}
          onClick={openCeateNewFoodPage}
        >
          Create New Food
        </ButtonWithImage>
      </div>
      <div style={styles.mainConteinerStyle}>
        <div style={styles.rowStyle}>
          <label  style={styles.labelTextFieldStyle} htmlFor="searchField">Search for food:</label>
          <input
          style={styles.textFieldStyle}
          type="text"
          id="searchField"  // Add an id attribute
          placeholder="Enter food name"
          value={searchQuery}
          onChange={(e) => {
              if (searchQuery !== e.target.value) {
                  setSearchQuery(e.target.value);
              }
          }}
          />
        </div>
        <FilterContainer
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <ResultContainer
          searchResult={searchResult}
          openAddFoodPage={openAddFoodPage}
        />
    </PageContainer>
  
}

export default SearchFood;
