import { useContext, useEffect, useState } from 'react';
import * as Constants from '../helpers/Constants.helper';
import { DataContext } from '../contexts/data.context';
import PageContainer from '../components/PageContainer.component';
import CustomDatePicker from '../components/CustomDatePicker.component';
import CategoryChart from '../components/StatisticBarChart.component';
import * as styles from '../components/styles/Dashboard.css';
import LoadingAndError from '../components/LoadingAndError.components';
import {
  useGetFoodForPeriod,
  useGetActivitiesForPeriod,
  useGetTrainingsForPeriod,
} from '../hooks/query.hooks';
import { Image } from '../components/Image.components';
import * as colors from '../components/styles/Colors';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import * as Enums from '../helpers/Enums.helper';

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

  const dateOneWeekAgo = () => {
    const oneWeekAgo = new Date();
    const date = oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date;
  };

  const [fromDate, setFromDate] = useState(
    loadState('fromDate', dateOneWeekAgo())
  );
  const [toDate, setToDate] = useState(loadState('toDate', Date()));
  const {
    user,
    currentProfile,
    currentDate,
    setCurrentDate,
    isSmallScreen,
    isMediumlScreen,
  } = useContext(DataContext);
  const [selectedFilter, setSelectedFilter] = useState(
    loadState('selectedFilterStatistic', Enums.FilterStatistic.CALORIES)
  );

  const {
    data: food,
    isLoading: isLoadingFood,
    isError: isErrorFood,
  } = useGetFoodForPeriod(user, currentProfile, fromDate, toDate);
  const {
    data: activities,
    isLoading: isLoadingActivities,
    isError: isErrorActivities,
  } = useGetActivitiesForPeriod(user, currentProfile, fromDate, toDate);
  const {
    data: trainings,
    isLoading: isLoadingTrainings,
    isError: isErrorTrainings,
  } = useGetTrainingsForPeriod(user, currentProfile, fromDate, toDate);

  useEffect(() => {
    saveState('fromDate', fromDate);
  }, [fromDate]);

  useEffect(() => {
    saveState('toDate', toDate);
  }, [toDate]);

  useEffect(() => {
    saveState('selectedFilterStatistic', selectedFilter);
  }, [selectedFilter]);

  const getDataSource = (selectedFilterNew) => {
    if (!selectedFilter) return [];
    switch (selectedFilter) {
      case Enums.FilterStatistic.CALORIES:
        return food;
      case Enums.FilterStatistic.ACTIVITIES:
        return activities;
      case Enums.FilterStatistic.TRAININGS:
        if (trainings) {
          return trainings.filter((training) => training.isCompleted);
        }
        return trainings;
    }
  };

  useEffect(() => {
    getDataSource();
  }, [isLoadingFood, isErrorFood, selectedFilter]);

  const getChartData = () => {
    const source = getDataSource();
    if (!source || source.length === 0) return [];

    //  Group data by date and calculate total calories and count
    const groupedData = source.reduce((result, currentItem) => {
      const formattedDate = new Date(currentItem.date).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
        }
      );

      const existingItemIndex = result.findIndex(
        (item) => item.name === formattedDate
      );

      if (existingItemIndex !== -1) {
        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          result[existingItemIndex].amount += Math.floor(
            (currentItem.calories / 100) * currentItem.weight
          );
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          result[existingItemIndex].amount += currentItem.duration;
        } else if (
          selectedFilter === Enums.FilterStatistic.TRAININGS &&
          currentItem.isCompleted
        ) {
          result[existingItemIndex].amount += 1;
        }
      } else {
        let newItem = {
          name: formattedDate,
          amount: 0,
        };

        if (selectedFilter === Enums.FilterStatistic.CALORIES) {
          newItem.amount = Math.floor(
            (currentItem.calories / 100) * currentItem.weight
          );
          result.push(newItem);
        } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
          newItem.amount = currentItem.burnedCalories;
          result.push(newItem);
        } else if (
          selectedFilter === Enums.FilterStatistic.TRAININGS &&
          currentItem.isCompleted
        ) {
          newItem.amount = 1;
          result.push(newItem);
        }
      }
      return result;
    }, []);

    // Determine the range of dates
    const startDate = new Date(fromDate); // replace with your actual start date
    const endDate = new Date(toDate); // replace with your actual end date
    const dateRange = getDatesBetween(startDate, endDate);

    // Fill in missing dates with 0 values
    const filledData = dateRange.map((date) => {
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const existingItem = groupedData.find(
        (item) => item.name === formattedDate
      );

      if (existingItem) {
        return existingItem;
      } else {
        return {
          name: formattedDate,
          amount: 0,
        };
      }
    });

    // Calculate overall average for the entire dataset
    const total = filledData.reduce((sum, item) => sum + item.amount, 0);
    const overallAverage = Math.floor(
      filledData.length !== 0 ? total / filledData.length : 0
    );

    // Assign overall average to each item in the grouped data
    const finalData = filledData.map((item) => ({
      ...item,
      average: overallAverage,
    }));

    // Sort the grouped data by date
    const sortedGroupedData = finalData.sort(
      (a, b) => new Date(a.name) - new Date(b.name)
    );

    return sortedGroupedData;
  };

  // Helper function to get an array of dates between two dates
  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getChartTitle = () => {
    const source = getDataSource();
    if (!source || source.length === 0) return '';
    if (selectedFilter === Enums.FilterStatistic.CALORIES) {
      return 'Total calories per day, kcal';
    } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
      return 'Burned calories per day, kcal';
    } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
      return 'Compleated trainings per day';
    }
  };

  const getGoal = () => {
    const source = getDataSource();
    if (!source || source.length === 0) return '';
    if (selectedFilter === Enums.FilterStatistic.CALORIES) {
      return getEstCalories();
    } else if (selectedFilter === Enums.FilterStatistic.ACTIVITIES) {
      return 0;
    } else if (selectedFilter === Enums.FilterStatistic.TRAININGS) {
      return 0;
    }
  };

  // Calculates estimated daily calories  weight based on Daily ratio %  and pet's weight
  function getEstCalories() {
    return Math.floor(
      Constants.estCalories * currentProfile.weight * currentProfile.dailyRatio
    );
  }

  const FilterContainer = () => {
    async function handleFilterChange(filter) {
      setSelectedFilter(filter);
    }

    const customTabStyle = {
      color: colors.green,
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
            {Object.values(Enums.FilterStatistic).map((filter) => (
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
            <CustomDatePicker label="To" value={toDate} onChange={setToDate} />
          </div>
        </div>
        <div style={styles.rowStyle}>
          <FilterContainer />
        </div>
      </styles.SelectDateContainer>
      {/* Chart section   */}
      {isLoadingFood || isErrorFood ? (
        <div>
          <div style={styles.placeholderContainerStyle}>
            <LoadingAndError isLoading={isLoadingFood} isError={isErrorFood} />
          </div>
        </div>
      ) : (
        <div style={styles.columnStyle}>
          {getChartData().length === 0 ? (
            <div>
              <div style={styles.placeholderContainerStyle}>
                <Image
                  imageName={'no_data_placeholder.png'}
                  width={'200'}
                  height={'170'}
                />
              </div>
            </div>
          ) : (
            <div style={styles.chartContainerStyle}>
              <CategoryChart
                data={getChartData(selectedFilter)}
                title={getChartTitle()}
                goal={getGoal()}
              />
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Analytics;
