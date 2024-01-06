/** @jsxImportSource @emotion/react */

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as colors from './styles/Colors';
import { styled } from '@mui/system';
import { Image } from '../components/Image.components';
import { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const CustomDatePickerWithArrows = ({
  label,
  value,
  onChange,
  styleContainer,
  stylePicker,
  backgroundColor,
  borderColor,
  disabled,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(value));

  // Create the CustomTextField component using Emotion's styled
  const CustomTextField = styled('input')({
    background: backgroundColor || 'none',
    borderRadius: '10px',
    padding: '10px',
    fontSize: '16px',
    width: '100px',
    border: `1px solid ${colors.white || 'none'}`,
    fontFamily: "'Balsamiq Sans', sans-serif",
    margin: '0 15px 0 15px',
    ...stylePicker,
  });

  const theme = createTheme({
    typography: {
      fontFamily: ['Balsamiq Sans'],
      fontSize: 14,
    },
  });

  return (
    <span style={styleContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          imageName={'arrow_left_black.svg'}
          width="20"
          height="20"
          onClick={() => onChange(new Date(dayjs(value) - 24 * 60 * 60 * 1000))}
          style={{ cursor: 'pointer' }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <DatePicker
              label="Small picker"
              value={dayjs(value)}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                onChange(new Date(dayjs(newDate)));
              }}
              slots={{ textField: CustomTextField }}
              slotProps={{ textField: { size: 'small' } }}
              disabled={disabled}
            />
          </ThemeProvider>
        </LocalizationProvider>
        <Image
          imageName={'arrow_right_black.svg'}
          width="20"
          height="20"
          onClick={() => {
            onChange(new Date(dayjs(value) + 24 * 60 * 60 * 1000));
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </span>
  );
};

export default CustomDatePickerWithArrows;
