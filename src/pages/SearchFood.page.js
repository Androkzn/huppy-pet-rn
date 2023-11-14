/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import { searchForFood } from "../graphql/graphqlUtils";
import * as Enums from "../helpers/Enums.helper"
import FoodCard from "../components/FoodCard.component"
import * as styles from "../components/styles/SearchFood.css"
import {ButtonWithImage} from '../components/Buttons.components'

const SearchFood = () => {
 
  const { user } = useContext(UserContext);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState("");
   // State for searchResult 
  const [searchResult, setResults] = useState([]);

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    console.log("Opening AddFoodPage for:", foodItem);

  };

  useEffect(() => {
    // Do not query an empty string
    if (searchQuery.length > 0) {
      searchFood(); // Load food data when the component mounts
    }
  }, [searchQuery]);

  // Func that is responsible for searching Food Templates in DB 
  async function searchFood() {
    const results = await searchForFood(searchQuery, user);
    setResults(results);
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
        <div style={styles.rowStyle}>
          {filterOptions.map((option) => (
              <label
                key={option}
                style={styles.labelFilterStyle}
              >
              <input
                style={styles.radioButtonStyle}
                type="radio"
                name="categoryOption"
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionChange(option)}
              />
                {option === "Filter by category" ? (
                    <label >
                    <span>Filter by category</span>
                    <select style={styles.dropdownStyle}>
                      {Object.values(Enums.FoodCategoryType).map((type, index) => (
                        <option key={index} value={Enums.getTitleUpercased(type)}>
                          {Enums.getTitleUpercased(type)}
                        </option>
                      ))}
                    </select>
                    </label>
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
              <FoodCard food={foodItem} openAddFoodPage={openAddFoodPage}/>
          </div>
        ))}
      </div>
    );
  };

  return <PageContainer>
    <div  style={styles.rowStyle}>
    <ButtonWithImage
          variant="backButton"
          navigateTo="/"
          imageName="back_arrow.svg"
          imageSize={20}
        >
         Back
        </ButtonWithImage>
      <ButtonWithImage
          variant="addButton"
          navigateTo="/createNewFood"
          imageName="plus_round_fill_white_button.svg"
          imageSize={25}
        >
          Add Food
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
