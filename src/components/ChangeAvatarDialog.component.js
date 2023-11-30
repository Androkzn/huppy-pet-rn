/** @jsxImportSource @emotion/react */

import { useContext, useState } from 'react';
import { UserContext } from "../contexts/user.context";
import * as styles  from './styles/Profile.css'
import { ButtonText } from "./Buttons.components"
import {ImageCircle} from './ImageCircle.components'

const ChangeAvatarDialog = ({onSave, onDelete, onClose, avatar }) => {

  return <div>
    <form style={styles.dialogLargeContainerStyle}>
      <div style={styles.closeDialogButtonContainer}>
        <ButtonText
          variant="circleTextButton"
          onClick={onClose} 
        >
          x
        </ButtonText>
      </div>
      <h2  style={styles.dialogTitleStyle}>{"Edit avatar"}</h2>
      <div style={styles.avatarContainerStyle}>
      <ImageCircle
          imageName={"avatar_placeholder.png"}
          width="75"
          height="75"
          imageDataUrl={avatar}
      />
  </div>
      <div style={styles.dialogButtonContainerStyle(avatar === "")}> 
        <ButtonText  variant="rectangleTextButton" onClick={() => onSave()} >
          Upload avatar
        </ButtonText>
        {avatar !== "" && <ButtonText variant="rectangleTextButton" onClick={() => onDelete()} >
          Delete avatar
        </ButtonText>}
     </div>
   
    </form>
  </div>;
}

export default ChangeAvatarDialog;