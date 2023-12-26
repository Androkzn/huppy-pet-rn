/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import * as styles  from '../components/styles/Training.css'
import * as colors from '../components/styles/Colors';
import {Image} from '../components/Image.components'
import { ReactComponent as TrainingIcon } from '../components/assets/training_tab_icon_unselected.svg'
import CustomDatePickerWithArrows from "../components/CustomDatePickerWithArrows.component";
import TrainingCard from '../components/TrainingCard.component';
import { Dialog, DialogContent } from '@mui/material';
import NewTrainingForm from "../components/NewTrainingForm.component";
import * as Enums from "../helpers/Enums.helper"
import {useAddTraining, useGetTrainingsForDate} from "../hooks/query.hooks"
import LoadingAndError from "../components/LoadingAndError.components"

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

  const {user, currentProfile, currentDate, setCurrentDate, isSmallScreen } = useContext(UserContext);
  // const [currentDate, setCurrentDate] = useState( loadState("currentDate", new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addTraining");
  const { data: trainings, isLoading: isLoadingTrainings, isError: isErrorTrainings} = useGetTrainingsForDate(user, currentProfile, currentDate);
  const {mutate: addTrainingMutation} = useAddTraining()


  // Opens dialog 
  const openDialog = (dialogTypeNew) => {
    setDialogType(dialogTypeNew)
    setDialogOpen(true);
  };
  
  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Handles dialog submission
  const handleDialogSubmit = (form, dialogType) => {
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
    if (dialogType === "addTraining") { 
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    } else if (dialogType === "showError") {
      
    } 
  };

  // Function is responsible for creating a new training
  const addTrainingForDate = async (data) => {
    addTrainingMutation({
      user: user, 
      currentProfile: currentProfile, 
      selectedDate: currentDate, 
      data: data,
    })
  };

  // Responsible for fetching data for  traings when data is changed
  useEffect(() => {
    saveState('currentDate', currentDate);
  }, [currentDate, currentProfile]);
 

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
              <TrainingCard  training={training}/>
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

  return <PageContainer>
      <div style={styles.columnStyle}>
      {!isSmallScreen && <DatePicker/>}
      
      {(isLoadingTrainings) || (isErrorTrainings) ?
        (
          <LoadingAndError isLoading = {isLoadingTrainings} isError = {isErrorTrainings}/>
        ) : (
          <Trainings trainingData={trainings}/>
        )}
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
