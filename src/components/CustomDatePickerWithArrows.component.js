import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

const CustomDatePickerWithArrows = ({ label, value, onChange, styleContainer })  => { 
  
  return (
    <span style={styleContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={() => onChange(new Date(value - 24 * 60 * 60 * 1000))}>
        &larr; {/* Left arrow */}
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={dayjs(value)}
            onChange={onChange}
            renderInput={(params) => <input {...params.inputProps} />}
          />
        </LocalizationProvider>
        <Button onClick={() => onChange(new Date(value + 24 * 60 * 60 * 1000))}>
        &rarr; {/* Right arrow */}
        </Button>
      </div>
    </span>
  );
}

export default CustomDatePickerWithArrows;