/**
 * Signup Screen — creating an account.
 *
 * The password rules are stated up front as a hint rather than only on failure,
 * and the field itself turns red only once what is typed actually breaks them.
 */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { TextField } from '@components/ios/TextField';
import { IOSButton } from '@components/ios/Button';
import { AuthLayout } from './AuthLayout';

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

  const emailError =
    email.length > 5 && !isEmailValid(email) ? 'Check this address' : null;
  const passwordError =
    password.length > 2 && !isPasswordValid(password) ? ' ' : null;
  const confirmationError =
    passwordConfirmation.length > 7 && password !== passwordConfirmation
      ? 'Passwords do not match'
      : null;

  const handleSubmit = async () => {
    try {
      await register(email.trim(), password);
      navigation.navigate('Register');
    } catch (error: any) {
      Alert.alert(
        'Could not create the account',
        error?.message || 'Please try again.'
      );
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="One account covers every pet in the household."
      actionLabel="Continue"
      onAction={handleSubmit}
      actionDisabled={!isFormValid}
      hint="Use at least 8 characters, with one number and one special character."
      footer={
        <IOSButton
          title="I already have an account"
          variant="plain"
          size="sm"
          onPress={() => navigation.navigate('Login')}
        />
      }
    >
      <TextField
        placeholder="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect={false}
        symbol="envelope"
        error={emailError}
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        placeholder="Password"
        textContentType="newPassword"
        password
        symbol="lock"
        error={passwordError}
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        placeholder="Repeat password"
        textContentType="newPassword"
        password
        symbol="lock.rotation"
        error={confirmationError}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />
    </AuthLayout>
  );
}
