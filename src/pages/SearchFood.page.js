/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../contexts/data.context';
import PageContainer from '../components/PageContainer.component';
import * as Enums from '../helpers/Enums.helper';
import FoodCard from '../components/FoodCard.component';
import * as styles from '../components/styles/SearchFood.css';
import { ButtonImage, ButtonLink } from '../components/Buttons.components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Image } from '../components/Image.components';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import * as colors from '../components/styles/Colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useSearchForFood } from '../hooks/query.hooks';
import LoadingAndError from '../components/LoadingAndError.components';
import CustomAlert from '../components/CustomAlert.component';

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
  const { user, isSmallScreen, currentDate } = useContext(DataContext);

  const [mealId, setMealId] = useState(
    location.state?.mealId || loadState('mealId', '')
  );
  // State for search query
  const [searchQuery, setSearchQuery] = useState(loadState('searchQuery', ''));
  // State for selected category filter
  const [selectedCategory, setSelectedCategory] = useState(
    loadState('selectedCategory', 'meat')
  );
  // State for radio buttons
  const [selectedFilter, setSelectedFilter] = useState(
    loadState('selectedFilter', Enums.FilterFood.ALL)
  );
  // Search results
  const {
    data: searchResult,
    isLoadingSearch,
    isErrorSearch,
  } = useSearchForFood(searchQuery, selectedFilter, selectedCategory, user);
  // State for search query for
  const [searchFilterQuery, setSearchFilterQuery] = useState(
    loadState('searchFilterQuery', '')
  );
  // States for displaying alert
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(Enums.AlertType.SUCCESS);

  // Navigation
  const navigateTo = async (link, state = {}) => {
    navigate('/' + link, { state });
  };

  // Function to open the AddFoodPage when a food item is clicked
  const openAddFoodPage = (foodItem) => {
    const state = { mealId, foodItem };
    navigateTo('addFood', state);
    //navigate('/addFood', { state: { mealId, foodItem} });
  };

  // Function to open the NewFoodPage when a a button is clicked
  const openCeateNewFoodPage = () => {
    const state = { mealId };
    navigateTo('createNewFood', state);
    //navigate('/createNewFood', { state: { mealId } });
  };
  // Function to clear search field
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  // Function to open alert
  const handleAlert = (messageNew, alertTypeNew) => {
    setMessage(messageNew);
    setAlertType(alertTypeNew);
    setShowAlert(true);
  };

  // Function to save state to localStorage whenever it changes
  useEffect(() => {
    saveState('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    saveState('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    saveState('searchResult', searchResult);
  }, [searchResult]);

  useEffect(() => {
    saveState('selectedFilter', selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    if (location.state?.mealId) {
      setMealId(location.state?.mealId);
      saveState('mealId', location.state?.mealId);
      saveState('selectedDate', location.state?.selectedDate);
    }
  }, [location.state]);

  const TopButtonContainer = () => {
    return (
      <div style={styles.buttonsContainerStyle}>
        <div style={styles.buttonsStyle}>
          <ButtonImage
            variant="backButton"
            onClick={() => navigateTo('')}
            imageName="arrow_left_green.svg"
            imageSize={20}
          >
            Back
          </ButtonImage>
          <ButtonImage
            variant="addButton"
            width="150px"
            imageName="add_round_orange.svg"
            imageSize={20}
            onClick={openCeateNewFoodPage}
          >
            Create Food
          </ButtonImage>
        </div>
      </div>
    );
  };

  const FilterContainer = () => {
    async function handleFilterChange(filter) {
      setSelectedFilter(filter);
    }

    const customTabStyle = {
      color: colors.green,
      fontWeight: 'bold',
      margin: '5px 0px 5px 0px',
      '&.Mui-selected': {
        color: colors.orange,
        backgroundColor: colors.orange,
      },
    };

    const customTabButtonStyle = {
      maxHeight: '20px',
      minWidth: '85px',
      padding: '0px',
      margin: '0px 0px 0px 0px',
      fontWeight: 'bold',
      fontSize: '14px',
      fontFamily: "'Balsamiq Sans', sans-serif",
      '&.Mui-selected': {
        color: colors.orange,
        backgroundColor: `rgba(43, 99, 98, 0.1)`,
        borderRadius: '10px',
      },
    };

    return (
      <div>
        <Box sx={customTabStyle}>
          <Tabs
            variant="fullWidth"
            value={selectedFilter}
            onChange={(event, newValue) => {
              handleFilterChange(newValue);
            }}
            indicatorColor="none"
          >
            {Object.values(Enums.FilterFood).map((filter) => (
              <Tab
                key={filter}
                sx={customTabButtonStyle}
                value={filter}
                label={filter}
              />
            ))}
          </Tabs>
        </Box>
      </div>
    );
  };

  const ResultContainer = ({ searchResult, openAddFoodPage }) => {
    // Check if searchResult is not defined or is an empty array

    if (!searchResult || searchResult.length === 0) {
      return (
        <div style={styles.placeholderStyle}>
          {selectedFilter === Enums.FilterFood.ALL &&
          searchQuery.length === 0 ? (
            <Image
              imageName="start_typing_placeholder.png"
              width="200"
              height="250"
            />
          ) : (
            <Image
              imageName="no_results_placeholder.png"
              width="200"
              height="250"
            />
          )}
        </div>
      );
    }

    return (
      <div style={styles.columnStyle}>
        {isLoadingSearch || isErrorSearch ? (
          <LoadingAndError
            isLoading={isLoadingSearch}
            isError={isErrorSearch}
          />
        ) : (
          <div style={styles.columnStyle}>
            {searchResult.map((foodItem, index) => (
              <FoodCard
                key={foodItem._id}
                food={foodItem}
                openAddFoodPage={() => openAddFoodPage(foodItem)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const SearchContainer = () => {
    async function handleCategoryChange(e) {
      const newValue = e.target.value;
      setSelectedCategory(newValue);
    }

    return (
      <div style={styles.rowStyle}>
        <label style={styles.labelTextFieldStyle} htmlFor="searchField">
          Search:
        </label>
        {selectedFilter === Enums.FilterFood.CATEGORY ? (
          <select
            style={styles.dropdownStyle}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedFilter(Enums.FilterFood.CATEGORY);
              handleCategoryChange(e);
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
            id="searchField" // Add an id attribute
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
        )}
      </div>
    );
  };

  return (
    <PageContainer>
      <div style={styles.fixedTopContainer(isSmallScreen)}>
        <TopButtonContainer />
        <styles.responsiveMainContainer>
          <FilterContainer
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {SearchContainer()}
        </styles.responsiveMainContainer>
      </div>
      <ResultContainer
        searchResult={searchResult}
        openAddFoodPage={openAddFoodPage}
      />
      <CustomAlert
        message={message}
        type={alertType}
        show={showAlert}
        setApperance={setShowAlert}
      />
    </PageContainer>
  );
};

export default SearchFood;
