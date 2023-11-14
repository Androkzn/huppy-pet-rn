import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';
import * as colors from './styles/Colors'

const useStyles = makeStyles((theme) => ({
  customCheckbox: {
    '&$checked': {
      color: colors.green, // Color of the checkmark when checked
    },
  },
  checked: {}, // Empty class for checked state
}));

const CustomCheckbox = ({ checked, onChange }) => {
  const classes = useStyles();

  return (
    <Checkbox
      classes={{
        root: classes.customCheckbox,
        checked: classes.checked,
      }}
      color="primary"
      checked={checked}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Select training' }}
    />
  );
};

export default CustomCheckbox;
