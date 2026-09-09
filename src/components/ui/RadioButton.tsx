/**
 * Custom Radio Button Component
 */

import React from 'react';
import { RadioButton as PaperRadioButton } from 'react-native-paper';

interface RadioButtonGroupProps {
  onValueChange: (value: string) => void;
  value: string;
  children: React.ReactNode;
}

interface RadioButtonItemProps {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioButtonComponent extends React.FC {
  Group: React.FC<RadioButtonGroupProps>;
  Item: React.FC<RadioButtonItemProps>;
  Android: typeof PaperRadioButton.Android;
  IOS: typeof PaperRadioButton.IOS;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  onValueChange,
  value,
  children,
}) => {
  return (
    <PaperRadioButton.Group onValueChange={onValueChange} value={value}>
      {children}
    </PaperRadioButton.Group>
  );
};

const RadioButtonItem: React.FC<RadioButtonItemProps> = ({
  label,
  value,
  disabled = false,
}) => {
  return (
    <PaperRadioButton.Item
      label={label}
      value={value}
      disabled={disabled}
      mode="android"
    />
  );
};

const RadioButtonBase: any = () => null;
RadioButtonBase.Group = RadioButtonGroup;
RadioButtonBase.Item = RadioButtonItem;
RadioButtonBase.Android = PaperRadioButton.Android;
RadioButtonBase.IOS = PaperRadioButton.IOS;

export const RadioButton = RadioButtonBase as RadioButtonComponent;
