/** @jsxImportSource @emotion/react */
import { useContext, useState } from 'react';
import { UserContext } from "../contexts/user.context";
import PageContainer from "./PageContainer.component";
import * as styles  from './styles/CreateNewActivity.css'
import {TitleAndDropdown} from "./Form.components"
import { ButtonText } from "./Buttons.components"
import * as Enums from "../helpers/Enums.helper"

const NewActivityForm = ({ onCreated, onClose }) => {
  const {currentProfile } = useContext(UserContext);
  const [value, setValue] = useState(0);
  // Some prefilled form state
  const [form, setForm] = useState({
    type: Enums.ActivityType.WALK,
    metric: Enums.ActivityMetric.DISTANCE,
    distance: 0,
    duration: 0,
    burnedCalories: 0,
  });

  const onTextInputChange = (event) => {
    const { value } = event.target;
    const valueActivity = value === "" ? 0 : parseInt(value, 10);
    setValue(valueActivity)
    form.metric === Enums.ActivityMetric.DISTANCE ?  setForm({ ...form, ["distance"]: valueActivity }) :  setForm({ ...form, ["duration"]: valueActivity });
    setForm({ ...form, ["burnedCalories"]: getCaloriesBurnedFor(valueActivity) });
  };

  const onDropdownInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
    let valueActivity = getActivityValue()
    setValue(valueActivity)
  };

  
  const getDropdownItems = (name) => {
    if (name === "type") {
      const dropdownItems=Object.values(Enums.ActivityType).map((type) => ({
        rawValue: type,
        title: Enums.getTitleForActivityType(type),
      }))
 
      return dropdownItems;
    } else {
      const dropdownItems= Object.values(Enums.ActivityMetric).map((type) => ({
        rawValue: type,
        title: Enums.getDDTitleForActivityMetric(type),
      }))
      return dropdownItems;
    }
  };

  const decrementCount = () => {
    setForm((prevForm) => {
      const newValue = form.metric === Enums.ActivityMetric.DISTANCE
        ? Math.max(0, prevForm.distance - 1)
        : Math.max(0, prevForm.distance - 10);
     
      const updatedForm = form.metric === Enums.ActivityMetric.DISTANCE
        ? { ...prevForm, distance: newValue }
        : { ...prevForm, duration: newValue };
      
      setValue(newValue)
      return { ...updatedForm, burnedCalories: getCaloriesBurnedFor(newValue) };
    });
  };
  
  const incrementCount = () => {
    setForm((prevForm) => {
      const newValue = form.metric === Enums.ActivityMetric.DISTANCE
        ? prevForm.distance + 1
        : prevForm.duration + 10;
  
      const updatedForm = form.metric === Enums.ActivityMetric.DISTANCE
        ? { ...prevForm, distance: newValue }
        : { ...prevForm, duration: newValue };
      
      setValue(newValue)
      return { ...updatedForm, burnedCalories: getCaloriesBurnedFor(newValue) };
    });
  };
  

  function getActivityValue() {
    return  form.metric === Enums.ActivityMetric.DISTANCE ? form.distance : form.duration;
  }

  function getCaloriesBurnedFor(value) {
    const weight = currentProfile.weight;
    if (form.metric === Enums.ActivityMetric.DISTANCE) {
      // To calculate the number of calories burned during a walk,
      // simply multiply your weight by the distance walked and then multiply by 0.8.
      return Math.floor(weight * value * 0.8);
    } else {
      // A 22-pound dog walking on a treadmill can burn around 2 calories in 1 minute
      return Math.floor(value * 2);
    }
  }

  return <div >
    <form style={styles.addActivityFormStyle}>
      <div style={styles.closeButtonContainer}>
        <ButtonText
          variant="circleTextButton"
          onClick={onClose} 
        >
          x
        </ButtonText>
      </div>
      <h2  style={styles.addActivityTitleStyle}>{"Add Activity"}</h2>
      
      <TitleAndDropdown name={"type"} title={"Activity"} dropdownOptions={getDropdownItems("type")} onChange={(value) => { onDropdownInputChange("type", value)}}/>
      <TitleAndDropdown name={"metric"} title={"Metric"} dropdownOptions={getDropdownItems("metric")}  onChange={(value) => { onDropdownInputChange("metric", value)}}/>
      <div style={styles.rowStyle}>
        <div style={styles.columnStyle}>
          <h4>{Enums.getDDTitleForActivityMetric(form.metric)}</h4> 
          <div style={styles.circleButtonsGroupStyle}>
          <ButtonText variant="circleTextButton" onClick={ decrementCount } name={"integerMetric"}>
            -
          </ButtonText>
          <input
            style={styles.textFieldStyle}
            value={value.toString()}
            onChange={(e) => {onTextInputChange(e);}}
            name={"integerMetric"} 
            type='number'
          />
          <ButtonText variant="circleTextButton" onClick={incrementCount}  name={"integerMetric"} >
            +
          </ButtonText>
        </div>

        </div>
        {/* <div style={styles.columnStyle}> */}
          {/* <h4>meters</h4> 
          <div style={styles.circleButtonsGroupStyle}>
            <ButtonText variant="circleTextButton" onClick={() => decrementCount()} name={"decimalMetric"}>
                -
              </ButtonText>
              <input
                style={styles.textFieldStyle}
                value={getActivityValue()}
                onChange={(e) => {
                  onFormInputChange(e)
                }}
                name={"decimalMetric"} 
              />
              <ButtonText variant="circleTextButton" type="button" onClick={incrementCount}  name={"decimalMetric"} >
                +
              </ButtonText>
            </div>
          </div> */}
      </div>
      <div style={styles.addActivityButtonContainerStyle}> 
        <ButtonText variant="rectangleTextButton" onClick={() => onCreated(form, "addActivity")} >
          Add Activity
        </ButtonText>
    </div>
    {form.burnedCalories > 0 && (  
    <div style={styles.estimatedCaloriesContainerStyle}> 
        <h4 style={styles.burnedCaloriesStyle}>Burned calories:</h4>
        <h4>{form.burnedCalories} kcal</h4>
    </div>
    )}
    </form>
  </div>;
}

export default NewActivityForm;