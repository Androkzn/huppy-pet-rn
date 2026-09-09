/**
 * Forgot Password Screen — port of the web app's ForgotPassword.page.js.
 *
 * Same lightBrown page as Login and Signup: the "RESET PASSWORD" heading,
 * email / password / repeat password pills, and the olive Reset Password
 * button, which stays disabled until all three are filled in.
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

type Props = AuthStackScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async () => {
    try {
      await register(email.trim(), password);
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('', error?.message || 'An error occurred. Please try again.');
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
            <Text style={styles.heading}>RESET PASSWORD</Text>
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
              <HuppyButton
                variant="login"
                onPress={handleSubmit}
                disabled={
                  email.length === 0 ||
                  password.length === 0 ||
                  passwordConfirmation.length === 0
                }
              >
                Reset Password
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
    marginTop: 200,
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
