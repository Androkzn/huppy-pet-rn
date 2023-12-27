/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import { DataContext } from "../contexts/data.context";
import { Image } from "./Image.components";
import {useDeleteTraining, useUpdateTraining} from "../hooks/query.hooks"
import * as styleTraining from "./styles/Training.css";
import { ButtonImage } from "./Buttons.components";
import * as Enums from "../helpers/Enums.helper";
import CustomCheckbox from "./Checkbox.component";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Constants from "../helpers/Constants.helper";
import '../components/styles/styles.css';
import * as colors from '../components/styles/Colors';
import Swipe  from '../components/Swipe.components.tsx';

function TrainingCard({ training }) {
  const { user } = useContext(DataContext);
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const {mutate: deleteTrainingMutation} = useDeleteTraining()
  const {mutate: updateTrainingMutation} = useUpdateTraining()

  async function handleCheckboxValueChange() {
    const updateData = {
      isCompleted: !training.isCompleted,
    };
    updateTrainingMutation({
      user: user,
      trainingId: training._id, 
      updateData: updateData,
    })
  }

  const deleteCurrentTraining = async () => {
    deleteTrainingMutation({
      user: user,
      _id: training._id
    })
  };

  const getTainingCategory = () => {
    // Check if training is a custom training
    if (training.customCategory.length > 0 && training.customType.length) {
      return training.customCategory;
    } else {
      return Enums.getTitleForTrainingCategory(training.category);
    }
  };

  const getTainingType = () => {
    // Check if training is a custom training
    if (training.customCategory.length > 0 && training.customType.length) {
      return training.customType;
    } else {
      return Enums.getTitleForTrainingType(training.type);
    }
  };

  return (
    <>
      {isSmallScreen ? (
        // Render swipeable component for small screens
        <Swipe
          onRightSwipe={handleCheckboxValueChange}
          onLeftSwipe={deleteCurrentTraining}
          height={60}  
          leftSwipeComponent={  <Image imageName={`delete_white.svg`} width="25" height="25" />}
          rightSwipeComponent={  <Image imageName={training.isCompleted ?  `cancel_green.svg` : `checkmark_white.svg`} width="20" height="20" />}
          onLeftSwipeConfirm={(onSuccess, onCancel) => {
            if (window.confirm("Do you really want to delete this item ?")) {
              onSuccess();
            } else {
              onCancel();
            }
          }}
          distructiveLeftSwipe={true}
          className="swiper"
          leftSwipeColor={colors.orange}
          rightSwipeColor={training.isCompleted ? colors.yellow : colors.lightGreen2}
        >
          <div
            style={{
              ...styleTraining.headerTrainingStyle(training.isCompleted),
            }}
          >
            <div style={styleTraining.rowStyle}>
              <div style={styleTraining.iconContainerStyle}>
                <Image imageName={`training_${training.category}.svg`} width="40" height="40" />
              </div>

              <div style={styleTraining.columnStyle}>
                <h4 style={styleTraining.textTitleStyle}>{getTainingCategory()}</h4>
                <h4 style={styleTraining.textStyle}>What to train: {getTainingType()}</h4>
              </div>
            </div>
          </div>
        </Swipe>
      ) : (
        // Render non-swipeable component for larger screens
        <div style={styleTraining.trainingConteinerStyle}>
          <div style={styleTraining.headerTrainingStyle(training.isCompleted)}>
            <div style={styleTraining.rowStyle}>
              <div style={styleTraining.iconContainerStyle}>
                <Image imageName={`training_${training.category}.svg`} width="40" height="40" />
              </div>

              <div style={styleTraining.columnStyle}>
                <h4 style={styleTraining.textTitleStyle}>{getTainingCategory()}</h4>
                <h4 style={styleTraining.textStyle}>What to train: {getTainingType()}</h4>
              </div>

              <CustomCheckbox checked={training.isCompleted} onChange={() => handleCheckboxValueChange()} />

              <ButtonImage
                variant="iconButton"
                imageName="delete_green.svg"
                imageSize={isSmallScreen ?  20: 30}
                onClick={() => deleteCurrentTraining()}
              /> 
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TrainingCard;

