/**
 * LoginTextInput — port of the web app's LoginTextInput (Form.components.js):
 * a white 270px pill with a drop shadow, green text, and an eye toggle on
 * password fields once something has been typed.
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';
import { Asset } from './Asset';

interface LoginTextInputProps extends Omit<TextInputProps, 'style'> {
  isPassword?: boolean;
  borderColor?: string;
}

export const LoginTextInput: React.FC<LoginTextInputProps> = ({
  isPassword = false,
  borderColor,
  value,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={[
        styles.container,
        borderColor ? { borderWidth: 2, borderColor } : null,
      ]}
    >
      <TextInput
        style={styles.textField}
        placeholderTextColor={colors.gray}
        secureTextEntry={isPassword && !showPassword}
        value={value}
        {...rest}
      />
      {isPassword && (value ?? '').trim() !== '' && (
        <Asset
          imageName={showPassword ? 'show_password.svg' : 'hide_password.svg'}
          width={20}
          height={20}
          fill={colors.green}
          onPress={() => setShowPassword(!showPassword)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    minWidth: 270,
    maxWidth: 270,
    // boxShadow: 0px 4px 4px rgba(0,0,0,0.25)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  textField: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 15,
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.green,
  },
});

export default LoginTextInput;
