/** @jsxImportSource @emotion/react */

import { useContext, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { UserContext } from "../contexts/user.context";
import { Image } from "./Image.components";
import { deleteTraining, updateTraining } from "../graphql/graphqlUtils";
import * as styleTraining from "./styles/Training.css";
import { ButtonWithImage, ButtonText } from "./Buttons.components";
import * as Enums from "../helpers/Enums.helper";
import CustomCheckbox from "./Checkbox.component";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Constants from "../helpers/Constants.helper";

function TrainingCard({ training, updateTrainings }) {
  const { user } = useContext(UserContext);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const isSmallScreen = useMediaQuery(Constants.smallScreen);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwiping: (event) => {
      // Determine swipe direction
      if (event.deltaX > 0) {
        setSwipeDirection("right");
      } else if (event.deltaX < 0) {
        setSwipeDirection("left");
      }
    },
    onSwiped: () => {
      setSwipeDirection(null);
      // Handle swiped actions here
      if (swipeDirection === "right") {
        handleCheckboxValueChange();
      } else if (swipeDirection === "left") {
        deleteCurrentTraining();
      }
    },
    trackTouch: true,
    trackMouse: true,
  });

  async function handleCheckboxValueChange() {
    const updateData = {
      isCompleted: !training.isCompleted,
    };
    const isUpdated = await updateTraining(user, training._id, updateData);

    if (isUpdated) {
      console.log("Training updated successfully:", updateData);
      updateTrainings();
    } else {
      console.log("Failed to update training.");
    }
  }

  const deleteCurrentTraining = async () => {
    console.log("isDeletedPressed");
    const isDeleted = await deleteTraining(user, training._id);
    console.log("isDeleted", isDeleted);
    if (isDeleted) {
      updateTrainings();
    }
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
        <div
          style={{ ...styleTraining.trainingConteinerStyle, transition: "transform 0.3s ease" }}
          {...handlers} // Spread the swipe handlers
        >
          <div
            style={{
              ...styleTraining.headerTrainingStyle(training.isCompleted),
              transform:
                swipeDirection === "left" ? "translateX(-50px)" : swipeDirection === "right" ? "translateX(50px)" : "translateX(0)",
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
        </div>
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

              <ButtonWithImage
                variant="iconButton"
                imageName="delete_icon.svg"
                imageSize={25}
                onClick={() => deleteCurrentTraining()}
              ></ButtonWithImage>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TrainingCard;
