/** @jsxImportSource @emotion/react */

import { forwardRef, useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material';
import * as colors from './styles/Colors';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const CustomAlert = ({ message, type, style, show, setApperance, timeout = "3000" }) => {
  const [open, setOpen] = useState(show);

  // Update the 'open' state when the 'show' prop changes
  useEffect(() => {
    setOpen(show);
    console.log("CustomAlert message" , message)
  }, [show]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setApperance(false);
    setOpen(false);
  };

  const defaultStyles = css({
    background: `${colors.grayBackground}`,
    borderRadius: '10px',
    width: '120px',
    fontSize: '16px',
    fontFamily: "'Balsamiq Sans', sans-serif",
    fontWeight: 'bold',
  });

  const mergedStyles = css(defaultStyles, style);

  const theme = createTheme({
    typography: {
      fontFamily: ['Balsamiq Sans'],
      fontSize: 14,
    },
  });

  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <ThemeProvider theme={theme}>
      <Snackbar open={open} autoHideDuration={timeout} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default CustomAlert;
