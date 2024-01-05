/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import MealCard from '../components/MealCard.component';
import * as styles from '../components/styles/Home.css';
import { Image } from '../components/Image.components';
import CustomDatePickerWithArrows from '../components/CustomDatePickerWithArrows.component';
import ActivityCard from '../components/ActivityCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewActivityForm from '../components/NewActivityForm.component';
import ChartPie from '../components/ChartPie.components';
import {
  FoodCategoryRow,
  ToggleStatisticSection,
  CaloriesStatisticSection,
  CategoriesStatisticSection,
} from '../components/Statistic.components';
import {
  useGetMealsForDate,
  useLoadFoodCategories,
  useGetFoodForDate,
  useGetActivitiesForDate,
  useAddMeal,
  useAddActivity,
} from '../hooks/query.hooks';
import LoadingAndError from '../components/LoadingAndError.components';

const Home = () => {
  // Function to load state from localStorage
  const loadState = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  // Function to save state to localStorage
  const saveState = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const {
    user,
    currentProfile,
    currentDate,
    setCurrentDate,
    isSmallScreen,
    isMediumlScreen,
  } = useContext(DataContext);

  // Responsible for fetching data for  meals/traings/activities/food when data is changed
  useEffect(() => {
    if (currentDate === null || currentDate === undefined) {
      setCurrentDate(new Date());
      saveState('currentDate', new Date());
    } else {
      saveState('currentDate', currentDate);
    }
  }, [currentDate, currentProfile]);

  function getTotalCategoryWeight(category) {
    return Math.floor(
      (currentProfile?.dailyPortion * category?.percentage) / 100
    );
  }

  const DatePicker = () => {
    return (
      <div style={styles.pickerContainerStyle}>
        <CustomDatePickerWithArrows
          label="Select date:"
          value={currentDate}
          onChange={(date) => setCurrentDate(date)}
          stylePicker={styles.pickerStyle}
        />
      </div>
    );
  };

  const Statistic = () => {
    const [isStatisticExpanded, setStatisticExpanded] =
      useState(!isSmallScreen);
    const [isStatisticToday, setStatisticToday] = useState(true);
    const {
      data: food,
      isLoading: isLoadingFood,
      isError: isErrorFood,
    } = useGetFoodForDate(user, currentProfile, currentDate, isStatisticToday);
    const {
      data: categories,
      isLoading: isLoadingCategories,
      isError: isErrorCategories,
    } = useLoadFoodCategories(user, currentProfile, currentProfile?.preset, true);
    const {
      data: activities,
      isLoading: isLoadingActivities,
      isError: isErrorActivities,
    } = useGetActivitiesForDate(user, currentProfile, currentDate);

    return (
      <div
        style={{
          ...styles.childConteinerStyle,
          marginTop: isSmallScreen ? '15px' : '0',
          marginBottom: isSmallScreen ? '10px' : '0',
        }}
      >
        <div
          style={styles.headerStyle}
          onClick={() => {
            isSmallScreen
              ? setStatisticExpanded(!isStatisticExpanded)
              : setStatisticExpanded(isStatisticExpanded);
          }}
        >
          <div style={styles.headerTiteStyle}>
            <div style={styles.headerArrowStyle}>
              <Image
                imageName={
                  isStatisticExpanded
                    ? 'arrow_down_green.svg'
                    : 'arrow_right_green.svg'
                }
                width="20"
                height="20"
              />
            </div>
            <div style={styles.headerTextStyle}>
              <div style={styles.headingStyle}>STATS</div>
              <div style={styles.headingStyle}>
                {isStatisticToday ? 'Today / Goal' : 'This week / Goal'}
              </div>
            </div>
          </div>
        </div>
        {isLoadingFood || isLoadingCategories || isLoadingActivities ? (
          <div style={styles.statisticContainerStyle}>
            <div style={styles.placeholderStyle}>
              <LoadingAndError
                isLoading={
                  isLoadingFood || isLoadingCategories || isLoadingActivities
                }
                isError={isErrorFood || isErrorCategories || isErrorActivities}
              />
            </div>
          </div>
        ) : (
          <div style={styles.statisticContainerStyle}>
            <CaloriesStatisticSection
              foodData={food}
              categories={categories}
              activities={activities}
              currentProfile={currentProfile}
              isStatisticToday={isStatisticToday}
              currentDate={currentDate}
            />
            {isStatisticExpanded && (
              <div>
                {categories.map((category) => (
                  <CategoriesStatisticSection
                    key={category.name}
                    category={category}
                    categories={categories}
                    currentProfile={currentProfile}
                    foodData={food}
                    isStatisticToday={isStatisticToday}
                    currentDate={currentDate}
                  />
                ))}
              </div>
            )}
            <ToggleStatisticSection
              initialValue={!isStatisticToday}
              onChange={() => {
                setStatisticToday(!isStatisticToday);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const Chart = () => {
    const {
      data: categories,
      isLoading,
      isError,
    } = useLoadFoodCategories(user, currentProfile, currentProfile?.preset);

    return (
      <div
        style={{
          ...styles.childConteinerStyle,
          marginTop: isSmallScreen ? '0px' : '10px',
        }}
      >
        <div style={styles.headerStyle}>
          <div style={styles.headerTiteStyle}>
            <div style={styles.headerArrowStyle}>
              <Image
                imageName={'arrow_down_green.svg'}
                width="20"
                height="20"
              />
            </div>
            <div style={styles.headerTextStyle}>
              <h3 style={styles.headingStyle}>DIET BALANCE</h3>
            </div>
          </div>
        </div>
        {/* Chart */}
        {isLoading || isError ? (
          <div style={styles.chartContainerStyle}>
            <div style={styles.placeholderStyle}>
              <LoadingAndError isLoading={isLoading} isError={isError} />
            </div>
          </div>
        ) : (
          <div>
            {categories && categories.length > 0 ? (
              <div style={styles.chartContainerStyle}>
                <div style={styles.chartStyle}>
                  <ChartPie data={categories} />
                </div>
                <div style={styles.chartLegentStyle}>
                  {categories.map((category) => (
                    <FoodCategoryRow
                      key={category?.name}
                      name={category?.name}
                      weight={getTotalCategoryWeight(category)}
                      color={category?.color}
                      value={category?.percentage}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={styles.placeholderStyle}>
                <Image
                  imageName={'no_data_placeholder.png'}
                  width={'200'}
                  height={'170'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const Meals = () => {
    const {
      data: meals,
      isLoading,
      isError,
    } = useGetMealsForDate(user, currentProfile, currentDate);
    // Adds empty meal for date

    const { mutate: addMealMutation } = useAddMeal();

    useEffect(() => {
      if (!isLoading && !isError && (meals === null || meals.length === 0)) {
        addMealMutation({ user, currentProfile, currentDate });
      }
    }, [isLoading, isError]);

    return (
      <div>
        {' '}
        {/* Meal container*/}
        {isLoading || isError ? (
          <div style={styles.placeholderStyle}>
            <LoadingAndError isLoading={isLoading} isError={isError} />
          </div>
        ) : (
          <div>
            {' '}
            {/* Meal container*/}
            {meals.map((meal, index) => (
              <div key={meal._id} style={{ marginBottom: '10px' }}>
                <MealCard
                  meal={meal}
                  index={index + 1}
                  mealsCount={meals.length}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const Activities = () => {
    const [isActivitiesExpanded, setActivitiesExpanded] = useState(true);
    const {
      data: activities,
      isLoading,
      isError,
    } = useGetActivitiesForDate(user, currentProfile, currentDate);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState('addActivity');
    const { mutate: addActivity } = useAddActivity();

    // Opens dialog
    const openDialog = (dialogTypeNew) => {
      setDialogType(dialogTypeNew);
      setDialogOpen(true);
    };

    // Closes dialog
    const closeDialog = () => {
      setDialogOpen(false);
    };

    // Handles dialog submission
    const handleDialogSubmit = (form, dialogType) => {
      if (dialogType === 'addActivity') {
        const data = {
          type: form.type,
          metric: form.metric,
          distance: form.distance,
          duration: form.duration,
          burnedCalories: form.burnedCalories,
        };

        addActivity({
          user: user,
          currentProfile: currentProfile,
          selectedDate: currentDate,
          data: data,
        });
      }

      closeDialog();
    };

    // Returns dialog component based on dialog type
    const getDialogContent = () => {
      if (dialogType === 'addActivity') {
        return (
          <NewActivityForm
            onCreated={handleDialogSubmit}
            onClose={closeDialog}
          />
        );
      }
    };

    return (
      <div
        style={{
          ...styles.childConteinerStyle,
          marginTop: isMediumlScreen ? '10px' : '0px',
        }}
      >
        {' '}
        {/* Activities container*/}
        <div style={styles.headerStyle}>
          {/* Header container*/}
          <div
            style={styles.headerTiteStyle}
            onClick={() => {
              isSmallScreen
                ? setActivitiesExpanded(!isActivitiesExpanded)
                : setActivitiesExpanded(isActivitiesExpanded);
            }}
          >
            <div style={styles.headerArrowStyle}>
              <Image
                imageName={
                  isActivitiesExpanded
                    ? 'arrow_down_green.svg'
                    : 'arrow_right_green.svg'
                }
                width="20"
                height="20"
              />
            </div>
            <div style={styles.headingStyle}>ACTIVITIES</div>
          </div>
          <button
            style={styles.headerAddButtonStyle}
            onClick={() => {
              if (isActivitiesExpanded) {
                openDialog('addActivity');
              } else {
                setActivitiesExpanded(!isActivitiesExpanded);
              }
            }}
          >
            <Image
              imageName="plus_round_fill_button.svg"
              width="30"
              height="30"
            />
          </button>
        </div>
        {/* Header container*/}
        {isLoading || isError ? (
          <div style={styles.columnStyle}>
            <div style={styles.placeholderStyle}>
              <LoadingAndError isLoading={isLoading} isError={isError} />
            </div>
          </div>
        ) : (
          <div style={styles.columnStyle}>
            {/* Activity container*/}
            {/* Show activity cards if data avaliable, if not -> show placeholder*/}
            {isActivitiesExpanded && activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity._id}>
                  <ActivityCard activity={activity} />
                </div>
              ))
            ) : (
              <div style={styles.placeholderStyle}>
                <Image
                  imageName={
                    isActivitiesExpanded
                      ? 'no_activities_placeholder.png'
                      : 'more_green.svg'
                  }
                  width={isActivitiesExpanded ? '200' : '30'}
                  height={isActivitiesExpanded ? '170' : '10'}
                />
              </div>
            )}
          </div>
        )}
        {/* Dialog */}
        {dialogOpen && (
          <Dialog open={dialogOpen}>
            <DialogContent>{getDialogContent()}</DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  return (
    <PageContainer style={styles.pageStyle}>
      <div style={styles.columnStyle}>
        {!isSmallScreen && <DatePicker />}
        <styles.responsiveMainContainer>
          <styles.responsiveSubContainer>
            <styles.columnLeftStyle>
              <Statistic />
              {/* Conditionally render Chart based on screen size */}
              {!isSmallScreen && <Chart />}
            </styles.columnLeftStyle>
            <styles.columnLeftStyle>
              <Meals />
            </styles.columnLeftStyle>
          </styles.responsiveSubContainer>

          <Activities />
        </styles.responsiveMainContainer>
      </div>
    </PageContainer>
  );
};

export default Home;
