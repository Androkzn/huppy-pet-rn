/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../contexts/data.context';
import * as styles from '../components/styles/Login.css';
import Spiner from '../components/Spinner.components';
import { Image } from '../components/Image.components';
import { ButtonText } from '../components/Buttons.components';

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
};

const containerStyle = {
  marginTop: 100,
};

const buttonContainerrStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 15,
};

const NotFound = () => {
  const navigate = useNavigate();
  const navigatedTo = (link) => {
    navigate('/' + link);
  };

  return (
    <div style={containerStyle}>
      <div style={placeholderStyle}>
        <h2>Sorry... nothing here.</h2>
        <Image imageName={'general_error.png'} width="270" height="170" />
        <div style={buttonContainerrStyle}>
          <ButtonText
            variant="login"
            onClick={() => navigatedTo('')}
            width={100}
          >
            Go home
          </ButtonText>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
