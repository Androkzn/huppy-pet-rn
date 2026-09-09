/**
 * Signup Screen — port of the web app's Signup.page.js.
 *
 * The same lightBrown page as Login, with the "CREATE ACCOUNT" heading, three
 * white pill inputs (email, password, repeat password), the orange validation
 * tip, the olive Continue button, and the "Have an account already?" row.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { LoginTextInput } from '@components/ui/LoginTextInput';
import { HuppyButton } from '@components/ui/Buttons';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

type Props = AuthStackScreenProps<'Signup'>;

const isEmailValid = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** At least 8 characters, one special character and one number. */
const isPasswordValid = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
};

export default function SignupScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const isFormValid =
    isEmailValid(email) &&
    isPasswordValid(password) &&
    isPasswordValid(passwordConfirmation) &&
    password === passwordConfirmation;

  const getValidationTip = (): string => {
    if (email.length > 5 && !isEmailValid(email)) {
      return 'Email has invalid format';
    }
    if (
      (password.length > 2 && !isPasswordValid(password)) ||
      (passwordConfirmation.length > 2 && !isPasswordValid(passwordConfirmation))
    ) {
      return 'Password must contain at least 8 characters, one special character an one number';
    }
    if (
      password.length > 7 &&
      passwordConfirmation.length > 7 &&
      password !== passwordConfirmation
    ) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async () => {
    try {
      await register(email.trim(), password);
      navigation.navigate('Register');
    } catch (error: any) {
      Alert.alert('', error?.message || 'An error occurred during sign up. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginContainer}>
          <View style={styles.loginHeader}>
            <Text style={styles.heading}>CREATE ACCOUNT</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <LoginTextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.formGroup}>
              <LoginTextInput
                placeholder="Password"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.formGroup}>
              <LoginTextInput
                placeholder="Repeat password"
                isPassword
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.validationTip}>{getValidationTip()}</Text>
            </View>
            <View style={styles.formGroup}>
              <HuppyButton
                variant="login"
                onPress={handleSubmit}
                disabled={!isFormValid}
              >
                Continue
              </HuppyButton>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Have an account already? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkLogin}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBrown,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loginContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 350,
    minWidth: 300,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.lightBrown,
  },
  loginHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 120,
  },
  heading: {
    color: colors.green,
    fontFamily: fontFamily.bold,
    fontSize: 25,
    width: 170,
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  formGroup: {
    alignItems: 'center',
    marginVertical: 10,
  },
  validationTip: {
    color: colors.orange,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    maxWidth: 300,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  rowText: {
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  linkLogin: {
    color: colors.orange,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    marginLeft: 20,
  },
});
