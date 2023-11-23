/** @jsxImportSource @emotion/react */

import { useContext, useState, useEffect  } from "react";
import * as styles  from './styles/Profile.css'
import {TitleAndDatePicker, TitleToggleAndButtons, TitleAndDropdown,SelectedFoodCategoryRow, UnselectedFoodCategoryRow, TitleButtonsAndTextField, TitleAndTextInput, TitleAndToggle, TitleTooltipAndValue} from "./Form.components"
import * as Enums from "../helpers/Enums.helper"
import * as Constants from "../helpers/Constants.helper"
import {Image} from './Image.components'
import {ImageCircle} from './ImageCircle.components'

const Profile = ({ profile, customFoodCategories, updateProfile, addCategory, deleteCategory, updateCategory}) => {
  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(true);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  const [isDailyRatioSelected, setDailyRatioSelected] = useState(false);
 
  
  const getUnusedCategories = () => {
    if (profile?.preset === Enums.RatioPresets.CUSTOM) {
      const remainingCategories =  Enums.getAllFoodCategories(profile._id);
      // Filter out categories that already exist
      const unusedCategories = remainingCategories.filter(
        (category) => !customFoodCategories.some((existingCategory) => existingCategory.index == category.index)
      );

      return unusedCategories;
    } else {
      return [];
    }
  };
  
  

  const getCategoriesForPresset = () => {
    if ( profile?.preset !== Enums.RatioPresets.CUSTOM) {
      const allCategoriesForPresset = Enums.getCategoriesForRatioPreset( profile?._id,  profile?.dailyPortion,  profile?.preset) 
      return allCategoriesForPresset;
    } else {
      return [];
    }
  }

  let categoriesCanBeAdded = getUnusedCategories()  
  let unusedCategoryPercentage = checkUnusedCategoryPercentage()

  // Save the profile to local storage whenever it changes
  useEffect(() => {
    profile.categories = getCategoriesForPresset()
  }, [profile.preset]);

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    updateProfile(name, value)
  };

  const onButtonInputChange = (name, value, id) => {
    // Handle Profile props changes
    if (name === "weight" || name === "dailyPortion" || name === "dailyRatio") {
     
      // Update dailyPortion if 
      if ( name === "dailyRatio" && isDailyRatioSelected) {
        updateProfile("dailyPortion", getPortionWeight(value))
      }  else {
        updateProfile(name, value)
      }

    }  else {
      updateCategory(id, value)
      checkUnusedCategoryPercentage()
    }

    
  };

  const handleToggleAndDDChange = (name, value) => {
    updateProfile(name, value)
  };

  const onTextInputChange = (event, id) => {
    const { value, name } = event.target;
    if (name === "weight" || name === "dailyPortion") {
      updateProfile(name, value)
    }  else {
      // Handle Food Category  changes
        updateCategory(id, value)
        checkUnusedCategoryPercentage()
    }
  };

  const onDatePickertChange = (event) => {
    if (event.$d) {
      // Check if toDate method is available (assuming toDate is used to convert)
      const dateValue = new Date(event.$d.valueOf());
    console.log("onDatePickertChange", dateValue);
    updateProfile("dob", dateValue);
    }
  }

  function getPortionWeight(dailyRatio) {
      const percentage = parseFloat( dailyRatio);
      const weight = parseFloat(profile.weight);
      const newPortionWeight = weight * (percentage / 100) * 1000;
      return Math.round(newPortionWeight);
  }
  

  function getEstCalories() {
    return Math.floor(Constants.estCalories * profile.weight * profile.dailyRatio);
  }
  
  function checkUnusedCategoryPercentage() {
    const usedPercentage = customFoodCategories.reduce((total, category) => {
      return total + category.percentage;
    }, 0);
    const result = 100 - usedPercentage;
    return result;
  }

  function getAge(dob) {
    const currentDate = new Date();
    const dobDate = new Date(dob);
    const diffInMilliseconds = currentDate - dobDate;

    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const millisecondsInMonth = 30 * millisecondsInDay;
    const millisecondsInYear = 365 * millisecondsInDay;

    const years = Math.floor(diffInMilliseconds / millisecondsInYear);
    const months = Math.floor((diffInMilliseconds % millisecondsInYear) / millisecondsInMonth);
    const days = Math.floor((diffInMilliseconds % millisecondsInMonth) / millisecondsInDay);

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

  function calculateRecommendedCalories() {
    let caloriesRecommended = 0;
  
    const months = calculateAgeInMonths(profile?.dob)

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

  function isAdultDog(dob) {
    const ageComponents = getAgeComponentForDOB(dob)
    const months = ageComponents.month || 1;
    const years = ageComponents.year || 0;
    return months === 12 || years >= 1;
  }

  function calculateAgeInMonths(dob) {
    const ageComponents = getAgeComponentForDOB(dob)
    return ageComponents.month || 1;
  }

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

  return <div style={styles.addFoodFormStyle}>
    <form onSubmit={(e) => {e.preventDefault(); }}>
      <h2  style={styles.profileTitleStyle}>{"Profile"}</h2>
  
      <div style={styles.imageContainerStyle}> 
          <ImageCircle imageName="avatar_placeholder.png" width="150" height="150"/>
      </div>
  
      <h2 style={styles.nameStyle}>{profile?.name}</h2>
      <h3 style={styles.ageStyle}>{getAge(profile?.dob)}</h3>

      <TitleAndTextInput  name={"name"} title={"Name"} initialValue={profile?.name} onChange={onFormInputChange} placeholder={"Enter name"}/>
      <TitleAndTextInput  name={"breed"} title={"Breed"} initialValue={profile?.breed} onChange={onFormInputChange} placeholder={"Enter breed"}/>
      
      {isAdultDog(profile?.dob) && (
      <TitleAndDropdown
      name={"activityType"}
      title={"Activity level"}
      initialValue={profile?.activityType} 
      dropdownOptions={Object.values(Enums.DogActivityType).map((type) => ({
        rawValue: type,
        title: Enums.getDogActivityTitle(type),
      }))}
      onChange={(value) => {
        handleToggleAndDDChange("activityType", value);
      }}
    />
      )}

      <TitleButtonsAndTextField
          title={"Weight, kg"}
          name={"weight"}
          initialValue={profile?.weight} 
          onChange={(e) => {
            onTextInputChange(e);  
          }}
          onSubmit={(e) => {
            onTextInputChange(e);
          }}
          onChangeButton={onButtonInputChange}
        />
        <TitleAndDatePicker 
          title={"Birthday"}
          name={"dob"}
          selectedDate={new Date(profile?.dob)} 
          onChange={(e) => {
            onDatePickertChange(e);  
         }}

        />

      <TitleAndDropdown 
        name={"size"} 
        title={"Breed size"}
        initialValue={profile?.size} 
        dropdownOptions={Object.values(Enums.BreedSize).map((type) => ({
          rawValue: type,
          title: Enums.getBreedSizeTitle(type),
        }))}
        onChange={(value) => {
          handleToggleAndDDChange("size", value);
        }}
       />

      <TitleAndToggle
        name={"deductCalories"} 
        title={"Deduct calories from activities"}
        onChange={ () => {handleToggleAndDDChange("deductCalories", !profile?.deductCalories)}}
        initialValue={profile?.deductCalories}
       />

      <div style={styles.foodRatioContainerStyle}>
        <div  style={styles.rowStyle}>
          <h3
            style={styles.nutritionFactsTitleStyle}
            onClick={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
          >
            {"Food Ratio"}
          </h3>
          <Image
            imageName={isFoodRatioExpanded ? "arrow_down.svg" : "arrow_right.svg"}
            width="20"
            height="20"
            onClick={() => setFoodRatioExpanded(!isFoodRatioExpanded)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {isFoodRatioExpanded && <div style={styles.foodRatioExpandedContainerStyle}>{
            <div>
              <TitleTooltipAndValue
                title="Recommended calories, kcal"
                tipText="Pets’ energy (Calorie) needs to maintain a healthy weight for their life stage depends upon several factors. First, the energy to perform essential body functions like digestion, respiration, heart functions, brain functions, etc. Resting Energy Requirements (or RER), which can be calculated by multiplying the animal’s body weight in kilograms raised to the ¾ power by 70, for example, a 10kg (22lb) adult neutered dog of healthy weight needs RER = 70(10kg)3/4 ≈ 400 Calories/day."
                value={calculateRecommendedCalories()}
              />

              {isDailyRatioSelected &&<TitleTooltipAndValue
                title="Estimated daily calories, kcal"
                tipText="Estimated daily calories is calculated based on "
                value={getEstCalories()}
              />
              }

              <TitleAndDropdown 
                name={"preset"} 
                title={"Food ratio preset"}
                dropdownOptions={Object.values(Enums.RatioPresets).map((type) => ({
                  rawValue: type,
                  title: Enums.getRatioPresetsTitle(type),
                }))}
                onChange={(value) => {
                  handleToggleAndDDChange("preset", value);
                }}
              />

              <TitleToggleAndButtons
                  name={"dailyRatio"} 
                  title={"Daily ratio from body weight"}
                  dailyRatioValue={profile?.dailyRatio}
                  toggleValue={isDailyRatioSelected}
                  onChangeToggle={ (value) => { 
                    setDailyRatioSelected(value) 
                    if (value) {
                      updateProfile("dailyPortion", getPortionWeight(profile?.dailyRatio))
                    }
                  }}
                  onChangeDailyRatioValue={ (value) => {onButtonInputChange("dailyRatio", value)}}
              />

              {/* {isDailyRatioSelected && */}
              { isDailyRatioSelected ? (
                  <TitleTooltipAndValue
                  title="Daily portion, g"
                  tipText="Calculated based on selected daily ratio"
                  value={profile?.dailyPortion}
                />
                ) : (
                  <TitleButtonsAndTextField
                    title={"Daily portion, g"}
                    name={"dailyPortion"}
                    initialValue={profile?.dailyPortion} 
                    onChange={(e) => {
                      onTextInputChange(e);  
                    }}
                    onSubmit={(e) => {
                      onTextInputChange(e);
                    }}
                    onChangeButton={onButtonInputChange}
                  />
                )}
 
              {/* Chart */}
              <div  style={styles.chartContainerStyle}>
                  CHART
              </div>
              {/* Unused calories reminder */}
              {unusedCategoryPercentage > 0 && <div style={styles.unusedCaloriesReminderStyle}> 
                You have {unusedCategoryPercentage}% unused! 
              </div>
              }

              {/* Selected categories */}
              <div  style={styles.selectedCategoriesContainerStyle}>
              <div style={styles.columnStyle}>
                {customFoodCategories.map((category)  => (
                    <SelectedFoodCategoryRow
                      key={category?.name}
                      name={category?.name}
                      remainingPercentage= {unusedCategoryPercentage}
                      weight={Math.floor(profile?.dailyPortion * category?.percentage / 100)}
                      color={category?.color}
                      value={category?.percentage} 
                      onChange={(e) => {onTextInputChange(e, category?._id);  }}
                      onDelete={() => {deleteCategory(category);}}
                      onChangeButton={(name,value) => {onButtonInputChange(name,value, category?._id)}}
                    />
                ))}
              </div>

              </div>
              {/* Select custom category container */}
              { categoriesCanBeAdded && categoriesCanBeAdded.length > 0 && (
              <div style={styles.foodRatioContainerStyle}>
                <div  style={styles.columnStyle}>
                <div  style={styles.rowStyle}>
                  <h3
                    style={styles.nutritionFactsTitleStyle}
                    onClick={() => setFoodCategoryExpanded(!isFoodCategoryExpanded)}
                  >
                    {isFoodCategoryExpanded ? "Hide categoties" : "Show category selection"}
                  </h3>
                  <Image
                    imageName={isFoodCategoryExpanded ? "arrow_down.svg" : "arrow_right.svg"}
                    width="20"
                    height="20"
                    onClick={() => setFoodCategoryExpanded(!isFoodCategoryExpanded)}
                    style={{ cursor: "pointer" }}
                  />
                  </div>

                  {isFoodCategoryExpanded && <div style={styles.unselectedCategoriesContainerStyle}>{
                    <div style={styles.unselectedFoodCategoryStyle}>
                      {categoriesCanBeAdded.map((category)  => (
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
                }
              </div>
            </div>
            )}
           </div>
        } 
        </div>}
      </div>
    </form>
  </div>;
}

export default Profile;