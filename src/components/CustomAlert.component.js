/** @jsxImportSource @emotion/react */

import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material';
import * as colors from './styles/Colors';
import Snackbar from '@mui/material/Snackbar';
import { ButtonImage } from './Buttons.components';
import Slide from '@mui/material/Slide';
import * as Enums from '../helpers/Enums.helper';

const CustomAlert = ({
  message,
  type,
  style,
  show,
  setApperance,
  timeout = 3000,
}) => {
  const [open, setOpen] = useState(show);
  const vertical = 'top';
  const horizontal = 'center';

  const background = () => {
    if (type === Enums.AlertType.SUCCESS) return colors.lightGreen2;
    if (type === Enums.AlertType.ERROR) return colors.orange;
    if (type === Enums.AlertType.INFO) return colors.gray;
  };

  // Update the 'open' state when the 'show' prop changes
  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setApperance(false);
    setOpen(false);
  };

  const defaultStyles = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: `${background()}`,
    borderRadius: '10px',
    width: '350px',
    height: '70px',
    fontSize: '16px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  });

  const mergedStyles = css(defaultStyles, style);

  const theme = createTheme({
    typography: {
      fontFamily: ['Balsamiq Sans'],
      fontSize: 14,
    },
  });

  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={timeout}
        onClose={handleClose}
        TransitionComponent={TransitionDown}
      >
        {
          <div css={defaultStyles}>
            <div css={{ margin: '0px 15px' }}>{message}</div>
            <ButtonImage
              variant="iconButton"
              imageName="close_round_white.svg"
              imageSize={30}
              onClick={handleClose}
            />
          </div>
        }
      </Snackbar>
    </ThemeProvider>
  );
};

export default CustomAlert;
