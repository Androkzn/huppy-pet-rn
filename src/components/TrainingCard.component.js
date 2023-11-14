/** @jsxImportSource @emotion/react */

import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import {Image} from './Image.components'
import { deleteTraining, updateTraining } from "../graphql/graphqlUtils";
import * as styleTraining from './styles/Training.css'
import {ButtonWithImage, ButtonText } from './Buttons.components'
import * as Enums from "../helpers/Enums.helper"
import CustomCheckbox from './Checkbox.component';

// Function is responsible for updating the training 
function TrainingCard({ training, updateTrainings}) {
  const { user } = useContext(UserContext);
 
  async function  handleCheckboxValueChange(){
    const updateData = {
      "isCompleted": !training.isCompleted,
    };
    const isUpdated = await updateTraining(user, training._id, updateData);

    if (isUpdated) {
        console.log('Training updated successfully:', updateData);
        updateTrainings()
    } else {
        console.log('Failed to update training.');
    }
  }
  
  // Function is responsible for deleting the training 
  const deleteCurrentTraining = async () => {
      console.log('isDeletedPressed')
     const isDeleted = await deleteTraining(user, training._id);
     console.log('isDeleted', isDeleted)
     if (isDeleted) {
      updateTrainings()
     }
  };

  const getTainingCategory = () => {
    // Check if traing is a custom training
    if (training.customCategory.length > 0 && training.customType.length) {
      return training.customCategory
  } else {
      return Enums.getTitleForTrainingCategory(training.category)
  }
  }

  const getTainingType = () => {
    // Check if traing is a custom training
    if (training.customCategory.length > 0 && training.customType.length) {
        return training.customType
    } else {
        return Enums.getTitleForTrainingType(training.type)
    }
  }

  return (
      <div style={styleTraining.trainingConteinerStyle} > 
        <div style={styleTraining.headerTrainingStyle(training.isCompleted)}>
          <div style={styleTraining.rowStyle}>
            <div style={styleTraining.iconContainerStyle}>
              <Image imageName={`training_${training.category}.svg`} width="40" height="40" />
            </div>  
            
            <div style={styleTraining.columnStyle}>
              <h4 style={styleTraining.textTitleStyle}>{getTainingCategory()}</h4>
              <h4 style={styleTraining.textStyle}>What to train: {getTainingType()}</h4>
            </div>
            { training.isCompleted && (    
              <div>
                <Image imageName="trophy.svg" width="40" height="40" />
              </div>
            )}
            <CustomCheckbox
              checked={training.isCompleted}
              onChange={() => handleCheckboxValueChange()}
            />

            <ButtonWithImage
              variant="iconButton"
              imageName="delete_icon.svg"
              imageSize={25}
              onClick={() => deleteCurrentTraining()}
            >
            </ButtonWithImage>
               
              
          
          </div> 
        </div>
      </div>
   );
}

export default TrainingCard;
