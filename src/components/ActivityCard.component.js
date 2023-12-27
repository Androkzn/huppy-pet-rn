/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { DataContext } from "../contexts/data.context.js";
import {Image} from './Image.components'
import * as stylesActivity from '../components/styles/Activity.css'
import {ButtonImage, ButtonText } from '../components/Buttons.components'
import * as enums from "../helpers/Enums.helper"
import Swipe  from './Swipe.components.tsx';
import * as colors from '../components/styles/Colors';
import {useDeleteActivity, useUpdateActivity} from "../hooks/query.hooks"

function ActivityCard({ activity}) {
  const { user, currentProfile } = useContext(DataContext);
  const {mutate: deleteActivityMutation} = useDeleteActivity()
  const {mutate: updateActivityMutation} = useUpdateActivity()


  function handleTextFieldValueChange(e) {
    const newValue = e.target.value === "" ? 0 : parseInt(e.target.value, 10);

    updateCurentActivity(newValue)
  }

  async function handleButtonValueChange(value) {
    const oldValue = getActivityValue()
    const newValue = Math.max(0, oldValue + value);
   
    updateCurentActivity(newValue)
  }

  async function handleMetricValueChange(e) {
    const newValue = e.target.value;
    const updateData = {
      "metric": newValue,
    };
    updateActivityMutation({
      user: user, 
      activityId: activity._id, 
      updateData: updateData,
    })
  }


  async function handleTypeValueChange(e) {
    const newValue = e.target.value;
    const updateData = {
      "type": newValue.toLowerCase(),
    };
    updateActivityMutation({
      user: user, 
      activityId: activity._id, 
      updateData: updateData,
    })
  }


  async function  updateCurentActivity(newValue){
    const updateData = {
      burnedCalories: getCaloriesBurnedFor(newValue),
      [activity.metric === enums.ActivityMetric.DISTANCE ? 'distance' : 'duration']: newValue,
    };

    updateActivityMutation({
      user: user, 
      activityId: activity._id, 
      updateData: updateData,
    })
  }
  
  // Function is responsible for deleting the activity 
  const deleteCurrentActivity = async () => {

    deleteActivityMutation({
      user: user,
      _id: activity._id,
    })
  };
   
  function getCaloriesBurnedFor(value) {
    const weight = currentProfile.weight;
    if (activity.metric === enums.ActivityMetric.DISTANCE) {
      // To calculate the number of calories burned during a walk,
      // simply multiply your weight by the distance walked and then multiply by 0.8.
      return Math.floor(weight * value * 0.8);
    } else {
      // A 22-pound dog walking on a treadmill can burn around 2 calories in 1 minute
      return Math.floor(value * 2);
    }
  }
  
  function getActivityValue() {
    return  activity.metric === enums.ActivityMetric.DISTANCE ? activity.distance : activity.duration;
  }

  function getChangeValueStep() {
    return  activity.metric === enums.ActivityMetric.DISTANCE ? 1 : 10;
  }

  
  const optionsActivityType= Object.values(enums.ActivityType).map((type) => ({
    rawValue: type,
    title: enums.getTitleForActivityType(type),
  }))

  const optionsActivityMetric= Object.values(enums.ActivityMetric).map((type) => ({
    rawValue: type,
    title: enums.getDDTitleForActivityMetric(type),
  }))
  
  return (
      <Swipe
        onLeftSwipe={deleteCurrentActivity}
        height={140}  
        leftSwipeComponent={  <Image imageName={`delete_white.svg`} width="25" height="25" />}
        onLeftSwipeConfirm={(onSuccess, onCancel) => {
          if (window.confirm("Do you really want to delete this item ?")) {
            onSuccess();
          } else {
            onCancel();
          }
        }}
        distructiveLeftSwipe = {true}
        rightSwipeComponent={  <Image imageName={ `edit_white.svg`} width="20" height="20" />}
        className="swiper-activity"
        leftSwipeColor={colors.orange}
        rightSwipeColor={colors.lightGreen2}
      >
        <div style={stylesActivity.headerActivityStyle}>
          <div style={stylesActivity.rowStyle}>
            <div style={stylesActivity.iconContainerStyle}>
              <Image imageName={`activity_${activity.type}.svg`} width="40" height="40" />
            </div>  
            <div style={stylesActivity.columnStyle}>
              <div style={stylesActivity.topRowStyle}>
                <select 
                    name={"activityType"}   
                    value={activity.type}  
                    style={stylesActivity.dropdownStyle}
                    onChange={(e) => handleTypeValueChange(e)}  
                  >
                    {optionsActivityType.map((item) => (
                      <option key={item.rawValue} value={item.rawValue}>
                        {item.title}
                      </option>
                    ))}
                  </select>
              </div>
              <div style={stylesActivity.bottomRowStyle}>Burned calories: {getCaloriesBurnedFor(getActivityValue())} kcal</div>
            </div>
          </div> 
        </div>

        <div style={stylesActivity.bodyActivityStyle}>
          <div style={stylesActivity.bodyRowStyle}>
            
            <select 
              name={"activityMetric"}  
              value={activity.metric}  
              style={stylesActivity.dropdownStyle}
              onChange={(e) => handleMetricValueChange(e)}
            >
            {optionsActivityMetric.map((item) => (
              <option key={item.rawValue} value={item.rawValue}>
                {item.title}
              </option>
            ))}
            </select>
         
            <div style={stylesActivity.rowStyle}>
              <ButtonText 
              variant="circleTextButton" 
              onClick={() => { handleButtonValueChange(-1 * getChangeValueStep()) }}  
              name={"integerMetric"} >
                -
              </ButtonText>
              <input
                type="number"
                style={stylesActivity.inputFieldStyle}
                value={getActivityValue()}
                onChange={(e) => handleTextFieldValueChange(e, activity)}
              />
              <ButtonText 
              variant="circleTextButton" 
              onClick={() => { handleButtonValueChange(getChangeValueStep()) }}  
              name={"integerMetric"} >
                +
              </ButtonText>
            </div>
          </div> 
        </div>
        </Swipe>
   );
}

export default ActivityCard;
