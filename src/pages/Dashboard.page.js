import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import CategoryChart from "../components/CategoryChart.component";
import {ButtonText } from '../components/Buttons.components'
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
  const [fromDate, setFromDate] = useState(Date());
  const [toDate, setToDate] = useState(Date());
  const {user, currentProfile, currentDate, setCurrentDate, isSmallScreen, isMediumlScreen} = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState( Enums.FilterStatistic.CALORIES);
  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetFoodForPeriod(user, currentProfile, fromDate, toDate);
  const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useGetActivitiesForPeriod(user, currentProfile, fromDate, toDate);
  const { data: trainings, isLoading: isLoadingTrainings, isError: isErrorTrainings } = useGetTrainingsForPeriod(user, currentProfile, fromDate, toDate);

  const getDataSource = (selectedFilterNew) => {
    console.log("selectedFilter", selectedFilter)
    console.log("food", food)
    console.log("activities", activities)
    console.log("trainings", trainings)
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
    const source = getDataSource()
    if (!source || source.length === 0) return []
    
    // Step 1: Group data by date and calculate total calories
    const groupedData = source.reduce((result, currentItem) => {
      console.log("currentItem", currentItem)
      const date = new Date(currentItem.date).toLocaleDateString();
      const formattedDate = new Date(currentItem.date).toLocaleDateString('en-US', {
        month: 'short', // abbreviated month name
        day: 'numeric', // day of the month
      });

      console.log("formattedDate", formattedDate)
      console.log("date", date)
      const existingItem = result.find(item => item.name === formattedDate);
      console.log("existingItem", existingItem)
      console.log("existingItem", existingItem)
      if (existingItem) {
        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          existingItem.amount += currentItem.calories;
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          existingItem.amount += currentItem.duration;
        } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
          existingItem.amount += 1;
        }
      } else {
        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          result.push({
            name: formattedDate,
            amount: currentItem.calories,
          });
          
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          result.push({
            name: formattedDate,
            amount: currentItem.burnedCalories,
          });
          
        } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
          result.push({
            name: formattedDate,
            amount: 1,
          });
        }
      }
      console.log("result", result)
      return result;
    }, []);

    // Step 2: Sort the grouped data by date
    const sortedGroupedData = groupedData.sort((a, b) => new Date(a.category) - new Date(b.category));
  
    console.log("sortedGroupedData", sortedGroupedData)

    return sortedGroupedData
  }

  const getChartTitle = () => {
    const source = getDataSource()
    if (!source || source.length === 0) return ""
    if (selectedFilter === Enums.FilterStatistic.CALORIES) {
      return "Total calories per day"
    } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
      return "Burned calories per day"
    } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
      return "Compleated trainings per day"
    }

  }
 
  console.log("getChartData", getChartData())

  const FilterContainer = () => {
 
    async function handleFilterChange(filter) {
      console.log("handleFilterChange:", filter);
      setSelectedFilter(filter)
    }
  
    const customTabStyle = {
      color:colors.green,
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
              <Tab key={filter.rawValue} sx={customTabButtonStyle} value={filter} label={filter} />
            ))}
          </Tabs>
        </Box>
      </div>
    )
  };


  return (
    <PageContainer>
      <styles.SelectDateContainer>
        <div style={styles.rowStyle}> 
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
            <div>
              <LoadingAndError isLoading = {isLoadingFood} isError = {isErrorFood}/>
            </div>
          </div>
          ) : 
          (
            <div style={styles.columnStyle}>
            { (getChartData().length === 0)   ? 
              (
              <div>
                <div>
                  <Image 
                    imageName= {"no_data_placeholder.png"}
                    width={ "200"}
                    height={"170"}
                  />
                </div>
              </div>
              ) : 
              (
                <CategoryChart
                  data={getChartData(selectedFilter)}
                  title = {getChartTitle()}
                />
              )}
              </div>
          )}
      
      
    </PageContainer>
  );
}

export default Analytics;