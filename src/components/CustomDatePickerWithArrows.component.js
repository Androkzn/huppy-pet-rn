import TextField from '@mui/material/TextField';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import * as colors from './styles/Colors'


const CustomDatePickerWithArrows = ({ label, value, onChange, styleContainer })  => { 
  
  return (
    <span style={styleContainer}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={() => onChange(new Date(dayjs(value) - 24 * 60 * 60 * 1000))}
          style={{
            fontSize: '24px',  
            color: colors.green,          
            width: '40px',          
            height: '40px',         
          }}
        >
        &larr; {/* Left arrow */}
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            value={dayjs(value)}
            onChange={onChange}
            renderInput={(params) => <input {...params.inputProps} />}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        <Button onClick={() => onChange(new Date(dayjs(value) + 24 * 60 * 60 * 1000))}
          style={{
            fontSize: '24px',  
            color: colors.green,          
            width: '40px',          
            height: '40px',         
          }}
        >
        &rarr; {/* Right arrow */}
        </Button>
      </div>
    </span>
  );
}

export default CustomDatePickerWithArrows;