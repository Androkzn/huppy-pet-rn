import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

const CustomDatePicker = ({ label, value, onChange, style }) => {
  return (
    <span style={style}>
     
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
    
    </span>
  );
};

export default CustomDatePicker;