/**
 * Realm Authentication Service
 */

import * as Realm from 'realm-web';

const REALM_APP_ID = process.env.EXPO_PUBLIC_REALM_APP_ID || '';

if (!REALM_APP_ID) {
  console.warn('REALM_APP_ID not found in environment variables');
}

// Initialize Realm App
export const realmApp = new Realm.App({ id: REALM_APP_ID });

/**
 * Get current authenticated user
 */
export const getCurrentRealmUser = (): Realm.User | null => {
  return realmApp.currentUser;
};

/**
 * Get access token for current user
 */
export const getAccessToken = async (): Promise<string | null> => {
  const user = getCurrentRealmUser();
  if (!user) {
    return null;
  }
  return user.accessToken;
};

/**
 * Login with email and password
 */
export const loginEmailPassword = async (
  email: string,
  password: string
): Promise<Realm.User> => {
  const credentials = Realm.Credentials.emailPassword(email, password);
  const user = await realmApp.logIn(credentials);
  return user;
};

/**
 * Register new user with email and password
 */
export const registerEmailPassword = async (
  email: string,
  password: string
): Promise<void> => {
  await realmApp.emailPasswordAuth.registerUser({ email, password });
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  const user = getCurrentRealmUser();
  if (user) {
    await user.logOut();
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  await realmApp.emailPasswordAuth.sendResetPasswordEmail({ email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  tokenId: string,
  newPassword: string
): Promise<void> => {
  await realmApp.emailPasswordAuth.resetPassword({
    password: newPassword,
    token,
    tokenId,
  });
};

/**
 * Confirm user email
 */
export const confirmUser = async (
  token: string,
  tokenId: string
): Promise<void> => {
  await realmApp.emailPasswordAuth.confirmUser({ token, tokenId });
};

/**
 * Resend confirmation email
 */
export const resendConfirmationEmail = async (email: string): Promise<void> => {
  await realmApp.emailPasswordAuth.resendConfirmationEmail({ email });
};

/**
 * Refresh access token for current user
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const user = getCurrentRealmUser();
  if (!user) {
    return null;
  }
  await user.refreshAccessToken();
  return user.accessToken;
};
