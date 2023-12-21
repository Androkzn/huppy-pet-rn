import { useContext, useEffect, useState } from "react";
import * as Constants from "../helpers/Constants.helper"
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import CategoryChart from "../components/StatisticBarChart.component";
import * as styles  from '../components/styles/Dashboard.css'
import LoadingAndError from "../components/LoadingAndError.components"
import {useGetFoodForPeriod, useGetActivitiesForPeriod, useGetTrainingsForPeriod} from "../hooks/query.hooks"
import {Image} from '../components/Image.components'
import * as colors from '../components/styles/Colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as Enums from "../helpers/Enums.helper"

const Analytics = () => {
   // Function to load state from localStorage
 const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const [fromDate, setFromDate] = useState( loadState("fromDate", Date()));
  const [toDate, setToDate] = useState( loadState("toDate", Date()));
  const {user, currentProfile, currentDate, setCurrentDate, isSmallScreen, isMediumlScreen} = useContext(UserContext);
  const [selectedFilter, setSelectedFilter] = useState( loadState("selectedFilterStatistic", Enums.FilterStatistic.CALORIES));
  
  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetFoodForPeriod(user, currentProfile, fromDate, toDate);
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useGetActivitiesForPeriod(user, currentProfile, fromDate, toDate);
  const { data: trainings, isLoading: isLoadingTrainings, isError: isErrorTrainings } = useGetTrainingsForPeriod(user, currentProfile, fromDate, toDate);

  useEffect(() => {
    saveState("fromDate", fromDate);
  }, [fromDate]);

  useEffect(() => {
    saveState("toDate", toDate);
  }, [toDate]);

  useEffect(() => {
    saveState("selectedFilterStatistic", selectedFilter);
  }, [selectedFilter]);

  const getDataSource = (selectedFilterNew) => {
    // console.log("selectedFilter", selectedFilter)
    // console.log("food", food)
    // console.log("activities", activities)
    // console.log("trainings", trainings)
    if (!selectedFilter) return []
    switch (selectedFilter) {
      case Enums.FilterStatistic.CALORIES: return food;
      case Enums.FilterStatistic.ACTIVITIES: return activities;
      case Enums.FilterStatistic.TRAININGS:  return trainings;
    }
  };

  useEffect(() => {
    getDataSource();  
  }, [isLoadingFood, isErrorFood, selectedFilter]);


  const getChartData = () => {
    const source = getDataSource();
    if (!source || source.length === 0) return [];
  
    // Step 1: Group data by date and calculate total calories and count
    const groupedData = source.reduce((result, currentItem) => {
      const date = new Date(currentItem.date).toLocaleDateString();
      const formattedDate = new Date(currentItem.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
  
      const existingItemIndex = result.findIndex(item => item.name === formattedDate);
  
      if (existingItemIndex !== -1) {
        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          result[existingItemIndex].amount += currentItem.calories;
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          result[existingItemIndex].amount += currentItem.duration;
        } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
          result[existingItemIndex].amount += 1;
        }
      } else {
        let newItem = {
          name: formattedDate,
          amount: 0,
        };
  
        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          newItem.amount = currentItem.calories;
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          newItem.amount = currentItem.burnedCalories;
        } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
          newItem.amount = 1;
        }
  
        result.push(newItem);
      }
  
      return result;
    }, []);
    
    // Step 2: Calculate overall average for the entire dataset
    const total = groupedData.reduce((sum, item) => sum + item.amount, 0);
    const overallAverage = groupedData.length !== 0 ? total / groupedData.length : 0;

    // Step 3: Assign overall average to each item in the grouped data
    const finalData = groupedData.map(item => ({
      ...item,
      average: overallAverage,
    }));
  
    // Step 4: Sort the grouped data by date
    const sortedGroupedData = finalData.sort((a, b) => new Date(a.name) - new Date(b.name));
  
    return sortedGroupedData;
  };
  
  

  const getChartTitle = () => {
    const source = getDataSource()
    if (!source || source.length === 0) return ""
    if (selectedFilter === Enums.FilterStatistic.CALORIES) {
      return "Total calories per day, kcal"
    } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
      return "Burned calories per day, kcal"
    } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
      return "Compleated trainings per day"
    }
  }

  const getGoal = () => {
    const source = getDataSource()
    if (!source || source.length === 0) return ""
    if (selectedFilter === Enums.FilterStatistic.CALORIES) {
      return getEstCalories()
    } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
      return 0
    } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
      return 0
    }
  }

  // Calculates estimated daily calories  weight based on Daily ratio %  and pet's weight
  function getEstCalories() {
    return Math.floor(Constants.estCalories * currentProfile.weight * currentProfile.dailyRatio);
  }
 

  const FilterContainer = () => {

    async function handleFilterChange(filter) {
      console.log("handleFilterChange:", filter);
      setSelectedFilter(filter)
    }
  
    const customTabStyle = {
      color:colors.green,
      fontWeight: 'bold',
      width: '100%',
      margin: '5px 0px 5px 0px',
      '&.Mui-selected': {
        color: colors.orange,
        backgroundColor: colors.orange,
      },
    };

    const customTabButtonStyle = {
      maxHeight: '20px',
      width: '100%',
      fontWeight: 'bold',
      fontSize: '14px',
      fontFamily: "'Balsamiq Sans', sans-serif",
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
            indicatorColor="none"
          >
            {Object.values(Enums.FilterStatistic).map((filter) => (
              <Tab key={filter} sx={customTabButtonStyle} value={filter} label={filter} />
            ))}
          </Tabs>
        </Box>
      </div>
    )
  };


  return (
    <PageContainer>
      <styles.SelectDateContainer>
        <div style={styles.datePickerContainerStyle}> 
          <div style={styles.datePickerStyle}> 
            <CustomDatePicker 
              label="From" 
              value={fromDate} 
              onChange={setFromDate} 
            />
          </div>
          <div style={styles.datePickerStyle}> 
            <CustomDatePicker 
              label="To" 
              value={toDate} 
              onChange={setToDate} 
            />
          </div>
        </div>
        <div style={styles.rowStyle}> 
           <FilterContainer/>
        </div>
        </styles.SelectDateContainer>
        {/* Chart section   */}
         {(isLoadingFood) || (isErrorFood)? 
          (
          <div>
            <div style={styles.placeholderContainerStyle}>
              <LoadingAndError isLoading = {isLoadingFood} isError = {isErrorFood}/>
            </div>
          </div>
          ) : 
          (
            <div style={styles.columnStyle}>
              { (getChartData().length === 0)   ? 
                (
                <div>
                  <div style={styles.placeholderContainerStyle}>
                    <Image 
                      imageName= {"no_data_placeholder.png"}
                      width={ "200"}
                      height={"170"}
                    />
                  </div>
                </div>
                ) : 
                (
                  <div style={styles.chartContainerStyle}>
                    <CategoryChart
                      data={getChartData(selectedFilter)}
                      title = {getChartTitle()}
                      goal={getGoal()}
                    />
                  </div>
                )
              }
            </div>
          )}
      
      
    </PageContainer>
  );
}

export default Analytics;