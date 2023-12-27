/** @jsxImportSource @emotion/react */

import { useTheme } from '@mui/material';
import { DataContext } from "../contexts/user.context";
import { useContext } from "react";

const PageContainer = (props) => {
  const theme = useTheme();
  const { isSmallScreen } = useContext(DataContext);

  const defaultPageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    marginTop: isSmallScreen ? '60px' :'90px',
    borderRadius: '10px',
    maxWidth: '900px',
    width: '95%',
    //minHeight:'85vh',
    justifyContent: 'centre',
    marginBottom: '100px',
  };

  const mergedStyles = { ...defaultPageStyle, ...props.style };

  return (
    <div style={mergedStyles}>
      {props.children}
    </div>
  );
};

export default PageContainer;
