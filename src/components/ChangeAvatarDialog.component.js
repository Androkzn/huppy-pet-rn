/** @jsxImportSource @emotion/react */

import { useContext, useState } from 'react';
import { UserContext } from "../contexts/user.context";
import * as styles  from './styles/Profile.css'
import { ButtonText,  ButtonWithImage } from "./Buttons.components"
import {ImageCircle} from './ImageCircle.components'

const ChangeAvatarDialog = ({onSave, onDelete, onClose, avatar }) => {
  console.log("avatar", avatar)
  return <div>
    <form style={styles.dialogLargeContainerStyle}>
      <div style={styles.closeDialogButtonContainer}>
        <ButtonWithImage
          variant="iconButton"
          as='button'
          imageName="cancel_orange.svg"
          imageSize={15}
          onClick={onClose}
        />
      </div>
      <h2  style={styles.dialogTitleStyle}>{"Edit avatar"}</h2>
      <div style={styles.avatarContainerStyle}>
      <ImageCircle
          imageName={"avatar_placeholder.png"}
          width="150px"
          imageDataUrl={avatar}
      />
  </div>
      <div style={styles.dialogButtonContainerStyle(avatar === null || avatar === "")}> 
        <ButtonText  width= {100} variant="rectangleTextButton" onClick={() => onSave()} >
          Upload
        </ButtonText>
        { avatar !== null && avatar !== "" && <ButtonText width= {100} variant="rectangleTextButton" onClick={() => onDelete()} >
          Delete
        </ButtonText>}
     </div>
   
    </form>
  </div>;
}

export default ChangeAvatarDialog;