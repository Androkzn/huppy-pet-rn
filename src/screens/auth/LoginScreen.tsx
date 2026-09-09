/**
 * Login Screen — port of the web app's Login.page.js + LoginForm.components.js.
 *
 * A lightBrown page with the "WELCOME TO HUPPY!" heading, two white pill
 * inputs, the olive Login button, and the forgot/signup row beneath it.
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
import { Spinner } from '@components/ui/Asset';
import * as colors from '../../theme/colors';
import { fontFamily } from '../../theme';

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
      // Navigation happens automatically via RootNavigator
    } catch (error: any) {
      // The web surfaces login failures through a plain alert.
      Alert.alert('', error?.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <Spinner />
      </View>
    );
  }

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
            <Text style={styles.heading}>WELCOME TO HUPPY!</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <LoginTextInput
                placeholder="Username"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.formGroup}>
              <LoginTextInput
                placeholder="Password"
                autoComplete="current-password"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.formGroup}>
              <HuppyButton
                variant="login"
                onPress={handleSubmit}
                disabled={username.length === 0 || password.length === 0}
              >
                Login
              </HuppyButton>
            </View>
          </View>

          <View style={styles.elementsInRow}>
            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.linkForgot}>Forgot password?</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkSignup}>Signup</Text>
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
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
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
  // The web pushes the heading down the page before the form.
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
  elementsInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  linkForgot: {
    color: colors.black,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  linkSignup: {
    color: colors.orange,
    fontFamily: fontFamily.regular,
    fontSize: 16,
    marginLeft: 20,
  },
});
