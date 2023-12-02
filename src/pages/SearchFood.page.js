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
import * as colors from '../components/styles/Colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const SearchFood = () => {
  // Function to load state from localStorage
const loadState = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

// Function to save state to localStorage
const saveState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

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
  const [selectedFilter, setSelectedFilter] = useState(loadState("selectedFilter", Enums.FilterFood.ALL));
  // State for date
  const [selectedDate, setSelectedDate] = useState(loadState("selectedDate", new Date() ));

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    navigate("/addFood", { state: { mealId, foodItem, selectedDate } });
  };

  const openCeateNewFoodPage = () => {
   navigate("/createNewFood", { state: { mealId, selectedDate } });
  };

  const updateSearchResults = () => {
    // Do not query an empty string if selected filter is "All"
    if (searchQuery.length > 0 || selectedFilter !== Enums.FilterFood.ALL) {
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
    setSelectedDate(location.state?.selectedDate)
    saveState("selectedDate", location.state?.selectedDate);

   }
  }, [location.state]);

  // Func that is responsible for searching Food Templates in DB based on search string
  async function searchFood() {
    console.log("searchFood for:", selectedFilter);
    if (selectedFilter === Enums.FilterFood.ALL) {
      const results = await searchForFood(searchQuery, user);
      setResults(results);
    } else if  (selectedFilter === Enums.FilterFood.CATEGORY) {
      const results = await getAllFoodTemplatesForCategory(user, selectedCategory)
      console.log("Filter by category results:", results);
      setResults(results);
    } else if  (selectedFilter === Enums.FilterFood.CUSTOM) {
      const results = await getAllCustomFoodTemplates(user)
      console.log("My food results:", results);
      setResults(results);
    } else if  (selectedFilter === Enums.FilterFood.RECIPE){
      setResults([]);
    }
    console.log("searchFood results:", searchResult);
  }

   const TopButtonContainer = () => {
    return (
      <div  style={styles.buttonsContainerStyle}>
        <div style={styles.buttonsStyle}>
        <ButtonWithImage
            variant="backButton"
            width='120px'
            to="/"
            imageName="arrow_left.svg"
            imageSize={20}
          >
          Back
        </ButtonWithImage>
        <ButtonWithImage
            variant="addButton"
            width='150px'
            as='button'
            imageName="plus_round_fill_white_button.svg"
            imageSize={20}
            onClick={openCeateNewFoodPage}
          >
            Create Food
        </ButtonWithImage>
        </div>
      </div>
    )
   }
 
    const FilterContainer = ({ selectedCategory, setSelectedCategory }) => {
 
      async function handleFilterChange(filter) {
        console.log("handleFilterChange:", filter);
        setSelectedFilter(filter)
      }
    
      const customTabStyle = {
         
        color:colors.green,
        fontWeight: 'bold',
        margin: '0px 0px 0px 0px',
        '&.Mui-selected': {
          color: colors.orange,
          backgroundColor: colors.orange,
        },
      };

      const customTabButtonStyle = {
        maxHeight: '20px',
        maxWidth: '10px',
        padding: '5px',
        margin: '10px 0px 10px 0px',
        fontWeight: 'bold',
        '&.Mui-selected': {
          color:  colors.orange,
          backgroundColor: `rgba(43, 99, 98, 0.1)`,
          borderRadius: '10px'
        },
      };
   
      return (
        <div>
          <Box  sx={customTabStyle}>
            <Tabs
              variant="fullWidth"
              value={selectedFilter}
              onChange={(event, newValue) => {
                console.log("e.target", newValue)
                handleFilterChange(newValue)
              }}
              textColor='${colors.orange}'
              indicatorColor="none"
            >
              {Object.values(Enums.FilterFood).map((filter) => (
                <Tab sx={customTabButtonStyle} value={filter} label={filter} />
              ))}
            </Tabs>
          </Box>
        </div>
      )
    };
    
    
  const ResultContainer = ({ searchResult, openAddFoodPage }) => {
      // Check if searchResult is not defined or is an empty array
    if (!searchResult || searchResult.length === 0) {
      return <div style={styles.placeholderStyle}>
        {selectedFilter === Enums.FilterFood.ALL &&  searchQuery.length === 0 ? (
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
    async function handleCategoryChange(e) {
      const newValue = e.target.value;
      console.log("handleCategoryChange:", newValue);
      setSelectedCategory(newValue)
    }

    return (
      <div style={styles.rowStyle}>
         <label  style={styles.labelTextFieldStyle} htmlFor="searchField">Search:</label>
         {selectedFilter ===  Enums.FilterFood.CATEGORY ? (
          <select
            style={styles.dropdownStyle}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedFilter(Enums.FilterFood.CATEGORY);
              handleCategoryChange(e)
            }}
          >
            {Object.values(Enums.FoodCategoryType).map((type, index) => (
              <option key={index} value={Enums.getTitleUpercased(type)}>
                {Enums.getTitleUpercased(type)}
              </option>
            ))}
          </select>
          ) : (
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
          )
        }
        
        
      </div>
    );
  };

  return <PageContainer>
      <TopButtonContainer/>
      <div style={styles.mainConteinerStyle}>
        <FilterContainer
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
         {SearchContainer()}
      </div>
      <ResultContainer
          searchResult={searchResult}
          openAddFoodPage={openAddFoodPage}
        />
    </PageContainer>
  
}

export default SearchFood;
