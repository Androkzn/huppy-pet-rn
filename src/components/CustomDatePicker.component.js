/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {createTheme, ThemeProvider} from "@mui/material"
import dayjs from 'dayjs';
import * as colors from './styles/Colors'

const CustomDatePicker = ({ label, value, onChange, style }) => {
  
  const defaultStyles = css({
    //border: '1px solid #000',  
    background: `${colors.grayBackground}`,  
    borderRadius: '5px',
    width: '150px',
    fontSize: "16px",
    fontFamily: "'Balsamiq Sans', sans-serif",
    fontWeight: "bold", 
  });

  const mergedStyles = css(defaultStyles, style);
  
  const theme = createTheme({
    typography: {
      fontFamily: ['Balsamiq Sans'],
      fontSize: 14,
    },
  });

  return (
    <span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
          <DatePicker
            label={label}
            value={dayjs(value)}
            onChange={onChange}
            slots={{
              textField: textFieldProps => <TextField {...textFieldProps} sx={mergedStyles} />
            }}
            slotProps={{ textField: {
              size: 'small', 
            } }}
          />
         </ThemeProvider>
      </LocalizationProvider>
    </span>
  );
};

export default CustomDatePicker;
