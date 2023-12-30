/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';
import * as styles from './styles/Profile.css';
import {
  TitleAndDatePicker,
  TitleToggleAndButtons,
  TitleAndDropdown,
  SelectedFoodCategoryRow,
  SelectedCustomFoodCategoryRow,
  UnselectedFoodCategoryRow,
  TitleButtonsAndTextField,
  TitleAndTextInput,
  TitleAndToggle,
  TitleTooltipAndValue,
} from './Form.components';
import * as Enums from '../helpers/Enums.helper';
import * as Constants from '../helpers/Constants.helper';
import { Image } from './Image.components';
import ChartPie from './ChartPie.components';
import { ImageCircle } from './ImageCircle.components';

const RegisterForm = ({
  profile,
  avatar,
  customFoodCategories,
  setProfile,
  addCategory,
  deleteCategory,
  updateCategory,
  setIsFormCompleated,
  updateAvatar,
}) => {
  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  const [categories, setCategories] = useState(customFoodCategories);

  // Returns unused categories that can be added to custom categories
  const getUnusedCategories = () => {
    if (profile?.preset === Enums.RatioPresets.CUSTOM) {
      const remainingCategories = Enums.getAllFoodCategories(profile._id);
      // Filter out categories that already exist
      const unusedCategories = remainingCategories.filter(
        (category) =>
          !categories.some(
            (existingCategory) => existingCategory.index == category.index
          )
      );

      return unusedCategories;
    } else {
      return [];
    }
  };

  // Provides default presset categories or returns custom categories depends on preset value
  const getCategoriesForPresset = () => {
    if (profile?.preset !== Enums.RatioPresets.CUSTOM) {
      const allCategoriesForPresset = Enums.getCategoriesForRatioPreset(
        profile?.dailyPortion,
        profile?._id,
        profile?.preset
      );
      return allCategoriesForPresset;
    } else {
      return customFoodCategories;
    }
  };

  let categoriesCanBeAdded = getUnusedCategories();
  let unusedCategoryPercentage = checkUnusedCategoryPercentage();
  let chartData = [];

  //Set Food categories whenever preset changes
  useEffect(() => {
    setCategories(getCategoriesForPresset());
  }, [profile.preset, customFoodCategories]);

  //Updates isFormCompleated flag
  useEffect(() => {
    const isCompleated =
      profile.name.length > 1 && unusedCategoryPercentage === 0;
    setIsFormCompleated(isCompleated);
  }, [profile.name, unusedCategoryPercentage]);

  // Handle form changes
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle "+" and "-" buttons changes
  const onButtonInputChange = (name, value, id) => {
    if (name === 'weight') {
      // Update dailyPortion if weight is changed
      setProfile({
        ...profile,
        dailyPortion: getPortionWeight(profile.dailyRatio, value),
        [name]: value,
      });
    } else if (name === 'dailyPortion') {
      setProfile({ ...profile, [name]: value });
    } else if (name === 'dailyRatio') {
      // Update dailyPortion if dailyRatio is changed
      if (profile?.isRatioSelected) {
        setProfile({
          ...profile,
          dailyPortion: getPortionWeight(value, profile.weight),
          [name]: value,
        });
      } else {
        setProfile({ ...profile, [name]: value });
      }
    } else {
      updateCategory(name, value);
      checkUnusedCategoryPercentage();
    }
  };

  // Handle toggles and drop downs changes
  const handleToggleAndDDChange = (name, value) => {
    // Update dailyPortion if dailyRatio is changed
    if (name === 'isRatioSelected') {
      // Update dailyPortion only when Daily ratio option is selected
      profile.isRatioSelected = value;
      if (value) {
        setProfile({
          ...profile,
          [name]: value,
          dailyPortion: getPortionWeight(profile?.dailyRatio, profile.weight),
        });
      } else {
        setProfile({ ...profile, [name]: value });
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // Handle text input fields changes
  const onTextInputChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  // Handle text input fields changes
  const onTextInputCategoryChange = (type, value) => {
    updateCategory(type, value);
    checkUnusedCategoryPercentage();
  };

  // Handle DOB changes
  const onDatePickertChange = (event) => {
    if (event.$d) {
      // Check if toDate method is available
      const dateValue = new Date(event.$d.valueOf());
      setProfile({ ...profile, dob: dateValue });
    }
  };

  // Handle deleting category
  const handleDeleteCategory = (category) => {
    deleteCategory(category);
    checkUnusedCategoryPercentage();
  };

  function getChartData() {
    const categoriesNew = getCategoriesForPresset();
    const data = categoriesNew.map((category) => ({
      name: category.name,
      weight: category.weight,
      percentage: category.percentage,
      color: category.color,
    }));
    chartData = data;
    return chartData;
  }

  // Calculates portion weight based on Daily ratio %
  function getPortionWeight(dailyRatio, weight) {
    if (profile.isRatioSelected) {
      const percentage = parseFloat(dailyRatio);
      const newPortionWeight = parseFloat(weight) * (percentage / 100) * 1000;
      const result = Math.round(newPortionWeight);
      return result;
    } else {
      return profile.dailyPortion;
    }
  }

  // Calculates estimated daily calories  weight based on Daily ratio %  and pet's weight
  function getEstCalories() {
    return Math.floor(
      Constants.estCalories * profile.weight * profile.dailyRatio
    );
  }

  // Calculates  unused %  for custom food categories
  function checkUnusedCategoryPercentage() {
    const usedPercentage = categories.reduce((total, category) => {
      return total + category.percentage;
    }, 0);
    const result = 100 - usedPercentage;
    return result;
  }

  // Generates string based on DOB
  function getAge(dob) {
    const currentDate = new Date();
    const dobDate = new Date(dob);
    const diffInMilliseconds = currentDate - dobDate;

    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const millisecondsInMonth = 30 * millisecondsInDay;
    const millisecondsInYear = 365 * millisecondsInDay;

    const years = Math.floor(diffInMilliseconds / millisecondsInYear);
    const months = Math.floor(
      (diffInMilliseconds % millisecondsInYear) / millisecondsInMonth
    );
    const days = Math.floor(
      (diffInMilliseconds % millisecondsInMonth) / millisecondsInDay
    );

    if (years > 0) {
      if (months > 0) {
        return `${years} years ${months} months`;
      } else {
        return `${years} years`;
      }
    } else if (months > 0) {
      if (days > 0) {
        return `${months} months ${days} days`;
      } else {
        return `${months} months`;
      }
    } else {
      return `${days} days`;
    }
  }

  // Calculates recommended daily calories
  function calculateRecommendedCalories() {
    let caloriesRecommended = 0;
    const months = calculateAgeInMonths(profile?.dob);

    if (months < 4) {
      caloriesRecommended = Math.floor(
        Enums.calculateBaseRER(profile?.weight) * 3
      );
    } else if (months < 12) {
      caloriesRecommended = Math.floor(
        Enums.calculateBaseRER(profile?.weight) * 2
      );
    } else {
      caloriesRecommended = Math.floor(
        Enums.calculateRER(profile?.weight, profile?.activityType)
      );
    }

    return caloriesRecommended;
  }

  // Checks if pet is adult
  function isAdultDog(dob) {
    const ageComponents = getAgeComponentForDOB(dob);
    const months = ageComponents.month || 1;
    const years = ageComponents.year || 0;
    return months === 12 || years >= 1;
  }

  // Calculates pet's age in months based on DOB
  function calculateAgeInMonths(dob) {
    const ageComponents = getAgeComponentForDOB(dob);
    return ageComponents.month || 1;
  }

  // Returns age components based on DOB
  function getAgeComponentForDOB(date) {
    const currentDate = new Date();
    const dob = new Date(date);

    // Check if dob is a valid date
    if (isNaN(dob.getTime())) {
      console.error('Invalid date of birth:', dob);
      return null;
    }

    const calendar = {
      dateComponents: function (fromDate, toDate) {
        const diff = toDate - fromDate;
        const oneDay = 24 * 60 * 60 * 1000;
        const days = Math.round(diff / oneDay);

        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;

        return {
          year: years,
          month: months,
          day: remainingDays,
        };
      },
    };

    // Calculate the difference in years, months, and days
    const ageComponents = calendar.dateComponents(dob, currentDate);
    return ageComponents;
  }

  const isChartDataAvailable = () => {
    const isaAvailable = getChartData().some(
      (category) => category.percentage > 0
    );
    return isaAvailable;
  };

  return (
    <div style={styles.profileFormStyle}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Avatar section */}
        <div style={styles.imageContainerStyle}>
          <ImageCircle
            imageName={'avatar_placeholder.png'}
            width={150}
            imageDataUrl={avatar ? URL.createObjectURL(avatar) : null}
            onClick={updateAvatar}
          />
        </div>

        <h2 style={styles.nameStyle}>{profile?.name}</h2>

        <h3 style={styles.ageStyle}>{getAge(profile?.dob)}</h3>

        {/* Name field */}
        <TitleAndTextInput
          name={'name'}
          title={'Name'}
          initialValue={profile?.name}
          onChange={onFormInputChange}
          placeholder={'Enter name'}
        />
        {/* Breed field */}
        <TitleAndTextInput
          name={'breed'}
          title={'Breed'}
          initialValue={profile?.breed}
          onChange={onFormInputChange}
          placeholder={'Enter breed'}
        />
        {/* Show Activity type field only for adult pets */}
        {isAdultDog(profile?.dob) && (
          <TitleAndDropdown
            name={'activityType'}
            title={'Activity level'}
            initialValue={profile?.activityType}
            dropdownOptions={Object.values(Enums.DogActivityType).map(
              (type) => ({
                rawValue: type,
                title: Enums.getDogActivityTitle(type),
              })
            )}
            onChange={(value) => {
              handleToggleAndDDChange('activityType', value);
            }}
          />
        )}
        {/* Weight field */}
        <TitleButtonsAndTextField
          title={'Weight, kg'}
          name={'weight'}
          initialValue={profile?.weight}
          onChange={(value) => {
            onTextInputChange('weight', value);
          }}
          onSubmit={(value) => {
            onTextInputChange('weight', value);
          }}
          onChangeButton={onButtonInputChange}
        />
        {/* Birthday field */}
        <TitleAndDatePicker
          title={'Birthday'}
          name={'dob'}
          selectedDate={new Date(profile?.dob)}
          onChange={(e) => {
            onDatePickertChange(e);
          }}
        />
        {/* Breed size field */}
        <TitleAndDropdown
          name={'size'}
          title={'Breed size'}
          initialValue={profile?.size}
          dropdownOptions={Object.values(Enums.BreedSize).map((type) => ({
            rawValue: type,
            title: Enums.getBreedSizeTitle(type),
          }))}
          onChange={(value) => {
            handleToggleAndDDChange('size', value);
          }}
        />
        {/* Deduct calories field */}
        <TitleAndToggle
          name={'deductCalories'}
          title={'Deduct calories from activities'}
          onChange={() => {
            handleToggleAndDDChange('deductCalories', !profile?.deductCalories);
          }}
          initialValue={profile?.deductCalories}
        />
        {/* Food ratio section */}
        <div style={styles.foodRatioContainerStyle}>
          <div style={styles.rowStyle}>
            <div
              style={styles.sectionTitleStyle}
              onClick={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
            >
              {'Food Ratio'}
            </div>
            <Image
              imageName={
                isFoodRatioExpanded
                  ? 'arrow_down_green.svg'
                  : 'arrow_right_green.svg'
              }
              width="20"
              height="20"
              onClick={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
              styles={styles.sectionImageContainerStyle}
            />
          </div>
          {/* Show if Food ratio expanded */}
          {isFoodRatioExpanded && (
            <div style={styles.foodRatioExpandedContainerStyle}>
              {
                <div>
                  {/*Recommended calories field */}
                  <TitleTooltipAndValue
                    title="Recommended calories, kcal"
                    tipText="Pets’ energy (Calorie) needs to maintain a healthy weight for their life stage depends upon several factors. First, the energy to perform essential body functions like digestion, respiration, heart functions, brain functions, etc. Resting Energy Requirements (or RER), which can be calculated by multiplying the animal’s body weight in kilograms raised to the ¾ power by 70, for example, a 10kg (22lb) adult neutered dog of healthy weight needs RER = 70(10kg)3/4 ≈ 400 Calories/day."
                    value={calculateRecommendedCalories()}
                  />
                  {/*Show Estimated daily calories field if Daily ratio selected*/}
                  {profile?.isRatioSelected && (
                    <TitleTooltipAndValue
                      title="Estimated daily calories, kcal"
                      tipText="Estimated daily calories is calculated based on pet's weight and selected daily ratio"
                      value={getEstCalories()}
                    />
                  )}
                  {/*"Food ratio preset field */}
                  <TitleAndDropdown
                    name={'preset'}
                    title={'Food ratio preset'}
                    dropdownOptions={Object.values(Enums.RatioPresets).map(
                      (type) => ({
                        rawValue: type,
                        title: Enums.getRatioPresetsTitle(type),
                      })
                    )}
                    onChange={(value) => {
                      handleToggleAndDDChange('preset', value);
                    }}
                    initialValue={profile?.preset}
                  />
                  {/*"Daily ratio field */}
                  <TitleToggleAndButtons
                    name={'dailyRatio'}
                    title={'Daily ratio from body weight'}
                    dailyRatioValue={profile?.dailyRatio}
                    toggleValue={profile?.isRatioSelected}
                    onChangeToggle={(value) => {
                      handleToggleAndDDChange('isRatioSelected', value);
                    }}
                    onChangeDailyRatioValue={(value) => {
                      onButtonInputChange('dailyRatio', value);
                    }}
                    maxCountValue={100}
                  />

                  {/*Do not allow change Daily portion if Daily ratio is selected */}
                  {profile?.isRatioSelected ? (
                    <TitleTooltipAndValue
                      title="Daily portion, g"
                      tipText="Calculated based on selected daily ratio"
                      value={profile?.dailyPortion}
                    />
                  ) : (
                    <TitleButtonsAndTextField
                      title={'Daily portion, g'}
                      name={'dailyPortion'}
                      initialValue={profile?.dailyPortion}
                      onChange={(value) => {
                        onTextInputChange('dailyPortion', value);
                      }}
                      onSubmit={(value) => {
                        onTextInputChange('dailyPortion', value);
                      }}
                      onChangeButton={onButtonInputChange}
                    />
                  )}

                  {/* Chart */}
                  <div style={styles.chartContainerStyle}>
                    {/* Show placeholder if no data */}
                    {isChartDataAvailable() ? (
                      <div>
                        <ChartPie data={getChartData()} />

                        {/* Unused calories reminder */}
                        {unusedCategoryPercentage > 0 && (
                          <div style={styles.unusedCaloriesReminderStyle}>
                            You have {unusedCategoryPercentage}% unused!
                          </div>
                        )}
                      </div>
                    ) : (
                      <Image
                        imageName={
                          getChartData().length > 0
                            ? 'no_percentage_placeholder.png'
                            : 'no_chart_placeholder.png'
                        }
                        width="190"
                        height="200"
                        onClick={() =>
                          setFoodRatioExpanded(!isFoodRatioExpanded)
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </div>

                  {/* Selected categories section*/}
                  <div style={styles.selectedCategoriesContainerStyle}>
                    <div style={styles.columnStyle}>
                      {categories.map((category) => (
                        <div key={category?.name}>
                          {profile?.preset === Enums.RatioPresets.CUSTOM ? (
                            <SelectedCustomFoodCategoryRow
                              name={category?.name}
                              remainingPercentage={unusedCategoryPercentage}
                              weight={Math.floor(
                                (profile?.dailyPortion * category?.percentage) /
                                  100
                              )}
                              color={category?.color}
                              value={category?.percentage}
                              onChange={(value) => {
                                onTextInputCategoryChange(category.type, value);
                              }}
                              onDelete={() => {
                                handleDeleteCategory(category);
                              }}
                              onChangeButton={(name, value) => {
                                onButtonInputChange(category.type, value, '');
                              }}
                            />
                          ) : (
                            <SelectedFoodCategoryRow
                              name={category?.name}
                              weight={Math.floor(
                                (profile?.dailyPortion * category?.percentage) /
                                  100
                              )}
                              color={category?.color}
                              value={category?.percentage}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select custom category section */}
                  {categoriesCanBeAdded && categoriesCanBeAdded.length > 0 && (
                    <div style={styles.foodRatioContainerStyle}>
                      <div style={styles.columnStyle}>
                        <div style={styles.rowStyle}>
                          <div
                            style={styles.sectionTitleStyle}
                            onClick={() =>
                              setFoodCategoryExpanded(!isFoodCategoryExpanded)
                            }
                          >
                            {isFoodCategoryExpanded
                              ? 'Hide categoties'
                              : 'Add more food categories'}
                          </div>
                          <Image
                            imageName={
                              isFoodCategoryExpanded
                                ? 'arrow_down_green.svg'
                                : 'arrow_right_green.svg'
                            }
                            width="20"
                            height="20"
                            onClick={() =>
                              setFoodCategoryExpanded(!isFoodCategoryExpanded)
                            }
                            styles={styles.sectionImageContainerStyle}
                          />
                        </div>

                        {isFoodCategoryExpanded && (
                          <div
                            style={styles.unselectedCategoriesContainerStyle}
                          >
                            {
                              <div style={styles.unselectedFoodCategoryStyle}>
                                {categoriesCanBeAdded.map((category) => (
                                  <UnselectedFoodCategoryRow
                                    key={category?.name}
                                    name={category.name}
                                    color={category.color}
                                    onAdd={() => {
                                      addCategory(category);
                                    }}
                                  />
                                ))}
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              }
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
