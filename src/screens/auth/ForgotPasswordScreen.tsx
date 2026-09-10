/**
 * Forgot Password Screen — setting a new password.
 */

import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { TextField } from '@components/ios/TextField';
import { IOSButton } from '@components/ios/Button';
import { AuthLayout } from './AuthLayout';

type Props = AuthStackScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const mismatch =
    passwordConfirmation.length > 0 && password !== passwordConfirmation;

  const handleSubmit = async () => {
    try {
      await register(email.trim(), password);
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert(
        'Could not reset the password',
        error?.message || 'Please try again.'
      );
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Confirm your email and choose a new password."
      actionLabel="Reset password"
      onAction={handleSubmit}
      actionDisabled={
        email.length === 0 ||
        password.length === 0 ||
        passwordConfirmation.length === 0 ||
        mismatch
      }
      footer={
        <IOSButton
          title="Back to sign in"
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
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        placeholder="New password"
        textContentType="newPassword"
        password
        symbol="lock"
        value={password}
        onChangeText={setPassword}
      />
      <TextField
        placeholder="Repeat password"
        textContentType="newPassword"
        password
        symbol="lock.rotation"
        error={mismatch ? 'Passwords do not match' : null}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />
    </AuthLayout>
  );
}
