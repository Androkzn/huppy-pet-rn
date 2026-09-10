/**
 * Login Screen — signing in.
 */

import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import { useAuth } from '@contexts/AuthContext';
import { TextField } from '@components/ios/TextField';
import { IOSButton } from '@components/ios/Button';
import { spacing } from '@theme/tokens';
import { AuthLayout } from './AuthLayout';

type Props = AuthStackScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await login(username.trim(), password);
      // Navigation happens automatically via RootNavigator.
    } catch (error: any) {
      Alert.alert(
        'Could not sign in',
        error?.message || 'Please check your details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to keep track of your pet's day."
      actionLabel="Sign in"
      onAction={handleSubmit}
      actionLoading={isLoading}
      actionDisabled={username.length === 0 || password.length === 0}
      footer={
        <View style={styles.footer}>
          <IOSButton
            title="Forgot password?"
            variant="plain"
            size="sm"
            onPress={() => navigation.navigate('ForgotPassword')}
          />
          <IOSButton
            title="Create an account"
            variant="plain"
            size="sm"
            onPress={() => navigation.navigate('Signup')}
          />
        </View>
      }
    >
      <TextField
        placeholder="Username"
        textContentType="username"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        symbol="person.crop.circle"
        value={username}
        onChangeText={setUsername}
      />
      <TextField
        placeholder="Password"
        textContentType="password"
        autoComplete="current-password"
        password
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        symbol="lock"
        value={password}
        onChangeText={setPassword}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});
