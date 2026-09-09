/**
 * Signup Screen
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthStackScreenProps } from '@navigation/types';
import { Button, TextInput, Container, Title, Body } from '@components/ui';
import { useAuth } from '@contexts/AuthContext';
import { isValidEmail, getPasswordStrengthMessage } from '@utils/validation';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@constants/index';
import { useTheme } from 'react-native-paper';

type Props = AuthStackScreenProps<'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const theme = useTheme();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!isValidEmail(email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!password.trim()) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else {
      const strengthMessage = getPasswordStrengthMessage(password);
      if (strengthMessage !== 'Strong password') {
        newErrors.password = strengthMessage;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_DONT_MATCH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password);
      Alert.alert('Success', 'Account created! Please create your pet profile.');
      // Navigate to Register screen to create profile
      navigation.navigate('Register');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert(
        'Signup Failed',
        error?.message || 'Unable to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrengthMessage(password);
  const showPasswordStrength = password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Container style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>Create Account</Title>
            <Body style={styles.subtitle}>Sign up to get started</Body>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!errors.email}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.email && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.email}
              </Body>
            )}

            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              secureTextEntry={!showPassword}
              error={!!errors.password}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {showPasswordStrength && (
              <Body
                style={[
                  styles.helperText,
                  {
                    color:
                      passwordStrength === 'Strong password'
                        ? theme.colors.primary
                        : theme.colors.error,
                  },
                ]}
              >
                {passwordStrength}
              </Body>
            )}
            {errors.password && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.password}
              </Body>
            )}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: undefined });
                }
              }}
              secureTextEntry={!showConfirmPassword}
              error={!!errors.confirmPassword}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.confirmPassword}
              </Body>
            )}

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signupButton}
            >
              Create Account
            </Button>

            <View style={styles.loginContainer}>
              <Body>Already have an account? </Body>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                disabled={isLoading}
                compact
              >
                Sign In
              </Button>
            </View>
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 12,
  },
  signupButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
