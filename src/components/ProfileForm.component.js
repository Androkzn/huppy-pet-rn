/** @jsxImportSource @emotion/react */

import * as styles  from './styles/Profile.css'
import {TitleAndDatePicker, TitleToggleAndButtons, TitleAndDropdown,SelectedFoodCategoryRow, UnselectedFoodCategoryRow, TitleButtonsAndTextField, TitleAndTextInput, TitleAndToggle, TitleTooltipAndValue} from "./Form.components"
import * as Enums from "../helpers/Enums.helper"
import {Image} from './Image.components'
import {ImageCircle} from './ImageCircle.components'
import { useState } from "react";

const Profile = ({ profile, setProfile }) => {
  const [isFoodRatioExpanded, setFoodRatioExpanded] = useState(false);
  const [isFoodCategoryExpanded, setFoodCategoryExpanded] = useState(false);
  
  const getUnusedCategories = () => {
    console.log("RatioPresets: ", profile?.preset)
    if ( profile?.preset === Enums.RatioPresets.CUSTOM) {
      let remainingCategories = []
      const allCategories = Object.values(Enums.FoodCategoryType) 
      console.log("allCategories: ", allCategories)
      
      const existingCategories = profile?.categories[0]
      for (let i = 0; i <allCategories.length; i++) {
        console.log(existingCategories.find(item => item.index === i) );

        if (existingCategories.find(item => item.index === i) === null) {

        }
      }
      
      return remainingCategories;
    } else {
      return [1];
    }
  }

  const getCategoriesForPresset = () => {
    if ( profile?.preset !== Enums.RatioPresets.CUSTOM) {
      const allCategoriesForPresset = Enums.getCategoriesForRatioPreset( profile?._id,  profile?.dailyPortion,  profile?.preset) 
      return allCategoriesForPresset;
    } else {
      return [];
    }
  }

  let categoriesCanBeAdded = getUnusedCategories()  
  let isDailyRatioFromWeightSelected = false
  let unusedCategoryPercentage = 0

  console.log("Profile: ", profile)
  console.log("Categories: ", profile.categories)

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const onButtonInputChange = (name, value) => {
    setProfile({ ...profile, [name]: value });
  };

  const onDDInputChange = (event) => {
    const { name, value } = event.target;
   
  };

  const onTextInputChange = (event) => {
    const { value } = event.target;
   
  };

  const handleToggle = () => {
    profile.deductCalories = !profile?.deductCalories;
  };

  const deleteCurrentCategory= (category) => {
    console.log("Category deleted: ", category)
  };

  const addCategory= (index) => {
    console.log("Category added index: ", index)
  };
  
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

  function calculateRecommendedCalories(profile) {
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
          name={"size"} 
          title={"Activity level"}
          dropdownOptions={Object.values(Enums.DogActivityType).map((type) => Enums.getDogActivityTitle(type))}  
          onChange={onDDInputChange}
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
           onTextInputChange(e);  
         }}

        />

      <TitleAndDropdown 
        name={"size"} 
        title={"Breed size"}
        dropdownOptions={Object.values(Enums.BreedSize).map((type) => Enums.getBreedSizeTitle(type))}  
        onChange={onDDInputChange}
       />

      <TitleAndToggle
        name={"deductCalories"} 
        title={"Deduct calories from activities"}
        onChange={handleToggle}
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
        {isFoodRatioExpanded && <div style={styles.foodRatioExpandedContainerStyle}>
          {
            <div>
              <TitleTooltipAndValue
                title="Recommended calories, kcal"
                tipText="Pets’ energy (Calorie) needs to maintain a healthy weight for their life stage depends upon several factors. First, the energy to perform essential body functions like digestion, respiration, heart functions, brain functions, etc. Resting Energy Requirements (or RER), which can be calculated by multiplying the animal’s body weight in kilograms raised to the ¾ power by 70, for example, a 10kg (22lb) adult neutered dog of healthy weight needs RER = 70(10kg)3/4 ≈ 400 Calories/day."
                value={calculateRecommendedCalories(profile)}
              />

              <TitleTooltipAndValue
                title="Estimated daily calories, kcal"
                tipText="Estimated daily calories is calculated based on "
                value={calculateRecommendedCalories(profile)}
              />

              <TitleAndDropdown 
                name={"size"} 
                title={"Food ratio preset"}
                dropdownOptions={Object.values(Enums.RatioPresets).map((type) => Enums.getRatioPresetsTitle(type))}  
                onChange={onDDInputChange}
              />

              <TitleToggleAndButtons
                  name={"dailyRatio"} 
                  title={"Daily ratio from body weight"}
                  initialValue={profile?.dailyRatio}
                  onChange={onDDInputChange}
              />

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

              {/* Chart */}
              <div  style={styles.chartContainerStyle}>
                  CHART
              </div>

              {/* Selected categories */}
              <div  style={styles.selectedCategoriesContainerStyle}>
              <div style={styles.columnStyle}>
                {profile?.categories[0].map((category, index)  => (
                    <SelectedFoodCategoryRow
                      name={category?.name}
                      weight={category?.weight}
                      color={category?.color}
                      value={category?.percentage} 
                      onChange={(e) => {
                        onTextInputChange(e);  
                      }}
                      onDelete={(e) => {
                        deleteCurrentCategory(category);
                      }}
                      onChangeButton={onButtonInputChange}
                    />
                ))}
              </div>

              </div>
              {/* Select custom category container */}
              { categoriesCanBeAdded && categoriesCanBeAdded.length > 0 && (
              <div style={styles.foodRatioContainerStyle}>
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
                {isFoodCategoryExpanded && <div style={styles.unselectedCategoriesContainerStyle}>
              {
                 <div  style={styles.selectedCategoriesContainerStyle}>
                  <div style={styles.columnStyle}>
                    {categoriesCanBeAdded.map((category, index)  => (
                       <UnselectedFoodCategoryRow
                       name={category.name} 
                       color={category.color}
                       onAdd={addCategory}
                       />
                    ))}
                  </div>
                 </div>
                } 
              </div>
              }
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