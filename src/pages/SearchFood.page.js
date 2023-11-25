/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import { getAllCustomFoodTemplates, getAllFoodTemplatesForCategory, searchForFood } from "../graphql/graphqlUtils";
import * as Enums from "../helpers/Enums.helper"
import FoodCard from "../components/FoodCard.component"
import * as styles from "../components/styles/SearchFood.css"
import {ButtonWithImage} from '../components/Buttons.components'
import { Clear} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import {Image} from '../components/Image.components'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

// Function to load state from localStorage
const loadState = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Function to save state to localStorage
const saveState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const SearchFood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // State for meal ID
  const [mealId, setMealId] = useState(location.state?.mealId || loadState("mealId", ""));
  // State for search query
  const [searchQuery, setSearchQuery] = useState(loadState("searchQuery", ""));
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState(loadState("selectedCategory", "meat"));
   // State for searchResult 
  const [searchResult, setResults] = useState(loadState("searchResult", []));
   // State for radio buttons 
  const [selectedFilter, setSelectedFilter] = useState(loadState("selectedFilter", "All"));

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    navigate("/addFood", { state: { mealId, foodItem } });
  };

  const openCeateNewFoodPage = () => {
   navigate("/createNewFood", { state: { mealId } });
  };

  const updateSearchResults = () => {
    // Do not query an empty string if selected filter is "All"
    if (searchQuery.length > 0 || selectedFilter !== "All") {
      searchFood(); 
    } else {
      setResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  useEffect(() => {
    updateSearchResults()
  }, [searchQuery, selectedFilter, selectedCategory]);

  // Function to save state to localStorage whenever it changes
  useEffect(() => {
    saveState("searchQuery", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    saveState("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    saveState("searchResult", searchResult);
  }, [searchResult]);

  useEffect(() => {
    saveState("selectedFilter", selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
   if (location.state?.mealId) {
    setMealId(location.state?.mealId);
    saveState("mealId", location.state?.mealId);
    console.log("mealId",location.state?.mealId)
   }
  }, [location.state]);

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

   const TopButtonContainer = () => {
    return (
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
    )
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
      return <div style={styles.placeholderStyle}>
        {selectedFilter === "All" &&  searchQuery.length === 0 ? (
          <Image imageName="start_typing_placeholder.png" width="200" height="250"/>
          ) : (
            <Image imageName="no_results_placeholder.png" width="200" height="250"/>
        )}
        </div>;
    }

    return (
      <div style={styles.columnStyle}>
        {searchResult.map((foodItem, index) => (
            <FoodCard key={foodItem.name} food={foodItem} updateSearchResults={updateSearchResults} openAddFoodPage={() => openAddFoodPage(foodItem)}/>
        ))}
      </div>
    );
  };

  const SearchContainer = () => {
    return (

      <div style={styles.rowStyle}>
         <label  style={styles.labelTextFieldStyle} htmlFor="searchField">Search for food:</label>
        <TextField 
          id="searchField"  // Add an id attribute
          placeholder="Enter food name"
          value={searchQuery}
          onChange={(e) => {
            if (searchQuery !== e.target.value) {
                setSearchQuery(e.target.value);
            }
        }}
          variant="outlined"
          InputProps={{
            style: styles.textFieldStyle,
            
            endAdornment: (
              <>
                {searchQuery ? (
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon />
                )}
              </>
            ),
          }}
          InputLabelProps={{
            focused: true, // Set to true to change label color when focused
          }}
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'Enter food name')}
        />
      </div>

      // <div style={styles.rowStyle}>
      //   <label  style={styles.labelTextFieldStyle} htmlFor="searchField">Search for food:</label>
      //   <input
      //   style={styles.textFieldStyle}
      //   type="text"
      //   id="searchField"  // Add an id attribute
      //   placeholder="Enter food name"
      //   value={searchQuery}
        // onChange={(e) => {
        //     if (searchQuery !== e.target.value) {
        //         setSearchQuery(e.target.value);
        //     }
        // }}
      //   />

 
      //   {searchQuery && (
      //     <div css={styles.clearButonStyle}><Clear onClick={() => handleClearSearch()} /></div>   
      //   )}
      // </div>
    );
  };

  return <PageContainer>
      <TopButtonContainer/>
      <div style={styles.mainConteinerStyle}>
        {SearchContainer()}
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
