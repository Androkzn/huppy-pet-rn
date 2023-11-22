/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';

const CustomDatePicker = ({ label, value, onChange, style }) => {
  
  const defaultStyles = css({
    border: '2px solid #ccc', // Customize the border style
    background: '#fff', // Customize the background color
    height: '40px', // Customize the height
    width: '300px', // Customize the width
  });

  const mergedStyles = css(defaultStyles, style);

  return (
    <span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={dayjs(value)}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} size='small' sx={mergedStyles}/>}
        />
      </LocalizationProvider>
    </span>
  );
};

export default CustomDatePicker;
