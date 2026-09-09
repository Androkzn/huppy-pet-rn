/**
 * Authentication against the Huppy backend.
 *
 * Replaces the Realm SDK, whose service (MongoDB Atlas App Services) reached
 * end of life. The shape here deliberately mirrors what `realm.ts` exported so
 * the screens and contexts around it did not have to change: a current user
 * with an `id`, an access token for the GraphQL client, and the same
 * login/register/logout calls.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

if (!API_URL) {
  console.warn('EXPO_PUBLIC_API_URL not found in environment variables');
}

const ACCESS_KEY = 'huppy.accessToken';
const REFRESH_KEY = 'huppy.refreshToken';
const USER_KEY = 'huppy.user';

/** Stands in for `Realm.User`; `id` is the field the screens already read. */
export interface AuthUser {
  id: string;
  email: string;
}

interface Session {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// Held in memory so the token is readable synchronously on every request;
// AsyncStorage is the durable copy, read once on startup.
let currentUser: AuthUser | null = null;
let accessToken: string | null = null;
let refreshToken: string | null = null;

async function persist(session: Session): Promise<void> {
  currentUser = { id: session.userId, email: session.email };
  accessToken = session.accessToken;
  refreshToken = session.refreshToken;

  await AsyncStorage.multiSet([
    [ACCESS_KEY, session.accessToken],
    [REFRESH_KEY, session.refreshToken],
    [USER_KEY, JSON.stringify(currentUser)],
  ]);
}

async function clear(): Promise<void> {
  currentUser = null;
  accessToken = null;
  refreshToken = null;
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error || `Request failed (${response.status})`);
  }
  return payload as T;
}

/**
 * Reloads the session saved on this device.
 *
 * Realm restored the session synchronously from its own store; here the read is
 * async, so callers await this once at startup before reading the current user.
 */
export const restoreSession = async (): Promise<AuthUser | null> => {
  if (currentUser) return currentUser;

  const stored = await AsyncStorage.multiGet([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
  const values = Object.fromEntries(stored) as Record<string, string | null>;
  if (!values[ACCESS_KEY] || !values[USER_KEY]) return null;

  try {
    currentUser = JSON.parse(values[USER_KEY] as string) as AuthUser;
  } catch {
    await clear();
    return null;
  }

  accessToken = values[ACCESS_KEY];
  refreshToken = values[REFRESH_KEY];
  return currentUser;
};

export const getCurrentUser = (): AuthUser | null => currentUser;

export const getAccessToken = async (): Promise<string | null> => accessToken;

export const loginEmailPassword = async (email: string, password: string): Promise<AuthUser> => {
  const session = await post<Session>('/auth/login', { email, password });
  await persist(session);
  return currentUser as AuthUser;
};

/**
 * Registering also signs the user in: the backend returns a session straight
 * away, so unlike Realm there is no email-confirmation round trip.
 */
export const registerEmailPassword = async (email: string, password: string): Promise<AuthUser> => {
  const session = await post<Session>('/auth/register', { email, password });
  await persist(session);
  return currentUser as AuthUser;
};

export const logout = async (): Promise<void> => {
  await clear();
};

/** Swaps the refresh token for a fresh pair; returns null once it has expired. */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshToken) return null;

  try {
    const session = await post<Session>('/auth/refresh', { refreshToken });
    await persist(session);
    return session.accessToken;
  } catch {
    // The refresh token is spent or invalid — the session is over.
    await clear();
    return null;
  }
};

export const sendPasswordResetEmail = async (_email: string): Promise<void> => {
  // Realm sent these itself. Reinstating them needs an email sender wired to
  // the backend, so fail loudly rather than pretending a mail went out.
  throw new Error('Password reset is not available yet');
};
