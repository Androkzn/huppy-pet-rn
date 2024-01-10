/** @jsxImportSource @emotion/react */

import { useContext, useState } from 'react';
import PageContainer from '../components/PageContainer.component';
import { DataContext } from '../contexts/data.context';
import * as styles from '../components/styles/More.css';
import { Dialog, DialogContent } from '@mui/material';
import NewTrainingForm from '../components/NewTrainingForm.component';
import { ReactComponent as LogoutIcon } from '../components/assets/logout_tab_icon_unselected.svg';
import { ReactComponent as HealthIcon } from '../components/assets/health_tab_icon_unselected.svg';
import { ReactComponent as DeleteAccountIcon } from '../components/assets/delete_account.svg';
import * as colors from '../components/styles/Colors';
import { Image } from '../components/Image.components';
import { useNavigate } from 'react-router-dom';

const More = () => {
  const navigate = useNavigate();
  const { logOutUser, deleteUserAccount } =
    useContext(DataContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('addTraining');

  // Opens dialog
  const openDialog = (dialogTypeNew) => {
    setDialogType(dialogTypeNew);
    setDialogOpen(true);
  };

  // Closes dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Handles dialog submission
  const handleDialogSubmit = (form, dialogType) => {
    if (dialogType === 'showError') {
    }

    closeDialog();
  };

  // Returns dialog component based on dialog type
  const getDialogContent = () => {
    if (dialogType === 'showError') {
      return (
        <NewTrainingForm onCreated={handleDialogSubmit} onClose={closeDialog} />
      );
    }
  };

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  };

  const deleteAccount = async () => {
    // Display a confirmation prompt
    const shouldDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    // Check if the user confirmed the action
    if (shouldDelete) {
      try {
        // Call the function to delete the user account
        await deleteUserAccount();
        // Reload the page or perform any other necessary actions
        window.location.reload(true);
      } catch (error) {
        // Handle errors, show a message, or log the error
        console.error('Error deleting account', error);
      }
    }
  };

  const navigateTo = (link) => {
    navigate('/' + link);
  };

  const LinkComponent = ({ title, icon, onClick }) => {
    return (
      <div style={styles.linkContainerStyle} onClick={onClick}>
        <div style={styles.linkNameContainerStyle}>
          <div style={styles.linkIconStyle}>{icon}</div>
          <div style={styles.linkTitleStyle}>{title}</div>
        </div>

        <div style={styles.linkArrowStyle}>
          <Image
            imageName={'arrow_right_green.svg'}
            width="15"
            height="15"
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      <div style={styles.columnStyle}>
        {/* // Health & Wellness */}
        {/* <LinkComponent
          title={'Health & Wellness'}
          icon={<HealthIcon fill={colors.green} width={30} height={30} />}
          onClick={() => navigateTo('')}
        /> */}
        {/* // Logout link */}
        <LinkComponent
          title={'Logout'}
          icon={<LogoutIcon fill={colors.green} width={30} height={30} />}
          onClick={logOut}
        />
        {/* // Logout link */}
        <LinkComponent
          title={'Delete account'}
          icon={
            <DeleteAccountIcon fill={colors.green} width={30} height={30} />
          }
          onClick={deleteAccount}
        />
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen}>
          <DialogContent>{getDialogContent()}</DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default More;
