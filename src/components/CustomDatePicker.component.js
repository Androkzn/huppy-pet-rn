/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import * as colors from './styles/Colors'

const CustomDatePicker = ({ label, value, onChange, style }) => {
  
  const defaultStyles = css({
    border: '1px solid #000',  
    background: `${colors.oliveLight}`,  
    borderRadius: '10px',
    width: '150px',
  });

  const mergedStyles = css(defaultStyles, style);

  return (
    <span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={dayjs(value)}
          onChange={onChange}
          slots={{
            textField: textFieldProps => <TextField {...textFieldProps} sx={mergedStyles} />
          }}
        />
      </LocalizationProvider>
    </span>
  );
};

export default CustomDatePicker;
