 /** @jsxImportSource @emotion/react */

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import * as colors from './styles/Colors'
import { styled } from '@mui/system';
import {Image} from '../components/Image.components'

const CustomDatePickerWithArrows = ({ label, value, onChange, styleContainer, stylePicker,  backgroundColor, borderColor })  => { 
  
// Create the CustomTextField component using Emotion's styled
const CustomTextField = styled('input')({
  background: backgroundColor || "none",
  borderRadius: '10px',
  padding: '10px', 
  fontSize: '16px', 
  width: '100px',
  border: `1px solid ${colors.white || "none"}`, 
  fontFamily: "'Balsamiq Sans', sans-serif",
  margin: '0 15px 0 15px',
  ...stylePicker
});

  return (
    <span style={styleContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          imageName={"arrow_left_black.svg"}
          width="20"
          height="20"
          onClick={() => onChange(new Date(dayjs(value) - 24 * 60 * 60 * 1000))}
          style={{ cursor: "pointer" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={dayjs(value)}
            onChange={onChange}
            renderInput={(params) => <CustomTextField {...params.inputProps}/>}
            slots={{ textField: CustomTextField }}
            slotProps={{ textField: { size: 'small'} }}
          />
        </LocalizationProvider>
        <Image
          imageName={"arrow_right_black.svg"}
          width="20"
          height="20"
          onClick={() => onChange(new Date(dayjs(value) + 24 * 60 * 60 * 1000))}
          style={{ cursor: "pointer" }}
        />
      </div>
    </span>
  );
}

export default CustomDatePickerWithArrows;