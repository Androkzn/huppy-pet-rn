/**
 * Forgot Password Screen
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
import { isValidEmail } from '@utils/validation';
import { ERROR_MESSAGES } from '@constants/index';
import { useTheme } from 'react-native-paper';

type Props = AuthStackScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return false;
    }
    if (!isValidEmail(email)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }
    return true;
  };

  const handleSendReset = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordReset(email.trim());
      Alert.alert(
        'Email Sent',
        'Password reset link has been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        error?.message || 'Unable to send reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
        <Container style={styles.content}>
          <View style={styles.header}>
            <Title style={styles.title}>Reset Password</Title>
            <Body style={styles.subtitle}>
              Enter your email and we'll send you a link to reset your password
            </Body>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) {
                  setError('');
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={!!error}
              disabled={isLoading}
              style={styles.input}
            />
            {error && (
              <Body style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Body>
            )}

            <Button
              mode="contained"
              onPress={handleSendReset}
              loading={isLoading}
              disabled={isLoading}
              style={styles.sendButton}
            >
              Send Reset Link
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
              style={styles.backButton}
            >
              Back to Login
            </Button>
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
  sendButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 16,
  },
});
