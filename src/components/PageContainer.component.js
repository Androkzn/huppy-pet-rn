/** @jsxImportSource @emotion/react */

import { useTheme } from '@mui/material';
import React from 'react';

const PageContainer = (props) => {
  const theme = useTheme();

  const defaultPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    padding: '15px',
    borderRadius: '10px',
    maxWidth: '900px',
    width: '100%',
    minHeight:'85vh',
    justifyContent: 'stretch',
  };

  const mergedStyles = { ...defaultPageStyle, ...props.style };

  return (
    <div style={mergedStyles}>
      {props.children}
    </div>
  );
};

export default PageContainer;
