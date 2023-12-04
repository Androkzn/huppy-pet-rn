/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import * as styles  from '../components/styles/Training.css'
import * as colors from '../components/styles/Colors';
import {Image} from '../components/Image.components'
import { ReactComponent as TrainingIcon } from '../components/assets/training_tab_icon_unselected.svg'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import { loadTrainings, addTraining} from "../graphql/graphqlUtils";
import TrainingCard from '../components/TrainingCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewTrainingForm from "../components/NewTrainingForm.component";
import * as Enums from "../helpers/Enums.helper"
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from "../helpers/Constants.helper"

const Training = () => {
    // Function to load state from localStorage
    const loadState = (key, defaultValue) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    };
  
    // Function to save state to localStorage
    const saveState = (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    };

  const {user, currentProfile } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState( loadState("currentDate", new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addTraining");
  const [trainingData, setTrainingData] = useState([]);
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

  // Opens dialog 
  const openDialog = (dialogTypeNew) => {
    console.log("openDialog", dialogTypeNew)
    setDialogType(dialogTypeNew)
    setDialogOpen(true);
  };
  
  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Handles dialog submission
  const handleDialogSubmit = (form, dialogType) => {
    console.log("handleDialogSubmit", form)
    
    if (dialogType === "addTraining") {
      let  customCategory = form.customCategory;
      // Check if custom type was selected  under base category
      if (form.category !==  Enums.TrainingCategory.CUSTOM && form.type === Enums.TrainingType.CUSTOM) {
        customCategory = Enums.getTitleForTrainingCategory(form.category)
      }

      const data = {
        "category": form.category,
        "type": form.type,
        "customCategory": customCategory,
        "customType": form.customType,
        "desc": form.description,
      }

      addTrainingForDate(data)
    } 
      
    closeDialog();
  };
 
  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    console.log("getDialogContent", dialogType)
    if (dialogType === "addTraining") { 
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } else if (dialogType === "showError") {
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } 
  };

  // Updates the Food from the response. 
  const loadTrainingsForDate = async () => {
    if (currentProfile) {
      const trainings  = await loadTrainings(user, currentProfile, currentDate); 
      setTrainingData(trainings);
    }
  };

  // Function is responsible for creating a new training
  const addTrainingForDate = async (data) => {
    const isAdded = await addTraining(user, currentProfile, currentDate, data)  
    if (isAdded) {
      updateTrainings();
    }
  };

  // Responsible for fetching data for  traings when data is changed
  useEffect(() => {
    updateTrainings()
    saveState('currentDate', currentDate);
  }, [currentDate, currentProfile]);
 
  const updateTrainings = () => {
    loadTrainingsForDate();
  }

  const DatePicker = () => {
    return (
    <div style={styles.rowStyle}>  
      <div style={styles.columnStyle}> 
        <div style={styles.pickerContainerStyle}> 
          <CustomDatePickerWithArrows
            label="Select date:"
            value={currentDate}
            onChange={(date) => setCurrentDate(date) }
            styleContainer= {styles.pickerStyle}
          />
        </div>
      </div>
    </div>  
    );
  };
  
  const Trainings = ({trainingData}) => {
    return (
      <div style={styles.childConteinerStyle}> {/* Trainings container*/}        
        <div style={styles.headerStyle}>{/* Header container*/}
          <div style={styles.headerTiteStyle}> 
            <h3 style={styles.headingStyle} >TRAININGS</h3>
            <div style={styles.headerImageStyle}>
              <TrainingIcon fill={colors.green}/>
            </div>
          </div>
          <button
            style={styles.headerAddButtonStyle}
            onClick={() => {
              openDialog("addTraining");
            }}
          >
            <Image imageName="plus_round_fill_button.svg" width="35" height="35" />
          </button>
        </div>{/* Header container*/}
        <div  style={styles.columnStyle}>{/* Trainings container*/}
          {/* Show Training cards if data avaliable, if not -> show placeholder*/}
          {trainingData && trainingData.length > 0 ? (
            trainingData.map((training) => 
            <div key={training._id}>
              <TrainingCard  training={training} updateTrainings={updateTrainings}/>
              </div>)
          ) : (
            <div style={styles.placeholderStyle}>
              <Image imageName="no_trainings_placeholder.png" width="200" height="170" />
            </div>
          )}
        </div> {/* Trainings container*/}
      </div> 
    );
  };

  return <PageContainer style={styles.pageStyle}>
      <div style={styles.columnStyle}>
        <DatePicker/>
        <Trainings trainingData={trainingData}/>
      </div>  
   
 
    {/* Dialog */}
    {dialogOpen && (          
      <Dialog open={dialogOpen} >
        <DialogContent>
          {getDialogContent()}
          </DialogContent>
      </Dialog>
    )}

  </PageContainer>
}

export default Training;
