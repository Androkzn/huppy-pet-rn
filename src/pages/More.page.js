/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import PageContainer from "../components/PageContainer.component";
import { UserContext } from '../contexts/user.context';
import * as styles  from '../components/styles/More.css'
import { Dialog, DialogContent } from '@mui/material';
import NewTrainingForm from "../components/NewTrainingForm.component";
import * as Enums from "../helpers/Enums.helper"
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from "../helpers/Constants.helper"

const More = () => {
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("addTraining");
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
    if (dialogType === "showError") {
       
    } 
      
    closeDialog();
  };
 
  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    console.log("getDialogContent", dialogType)
    if (dialogType === "showError") { 
      return <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog}/>
    }  
  };


  return <PageContainer style={styles.pageStyle}>
      <div style={styles.columnStyle}>
        More option
        
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

export default More;
