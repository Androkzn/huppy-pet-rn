/**
 * The session.
 *
 * Signing in has to survive a relaunch, signing out has to leave nothing
 * behind, and a corrupt stored session must not lock the user out of the app.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'huppy.accessToken';
const REFRESH_KEY = 'huppy.refreshToken';
const USER_KEY = 'huppy.user';

const session = {
  userId: 'u-1',
  email: 'owner@huppy.test',
  accessToken: 'access-1',
  refreshToken: 'refresh-1',
};

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

/** Each test gets a fresh module, since the session is module state. */
const loadService = () => {
  let service: typeof import('../authService');
  jest.isolateModules(() => {
    service = require('../authService');
  });
  return service!;
};

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([]);
});

describe('signing in', () => {
  it('returns the user and keeps the tokens for later requests', async () => {
    global.fetch = jest.fn(() => jsonResponse(session)) as jest.Mock;
    const auth = loadService();

    const user = await auth.loginEmailPassword('owner@huppy.test', 'secret');

    expect(user).toEqual({ id: 'u-1', email: 'owner@huppy.test' });
    expect(auth.getCurrentUser()).toEqual(user);
    await expect(auth.getAccessToken()).resolves.toBe('access-1');
  });

  it('saves the session so it survives a relaunch', async () => {
    global.fetch = jest.fn(() => jsonResponse(session)) as jest.Mock;
    const auth = loadService();

    await auth.loginEmailPassword('owner@huppy.test', 'secret');

    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      [ACCESS_KEY, 'access-1'],
      [REFRESH_KEY, 'refresh-1'],
      [USER_KEY, JSON.stringify({ id: 'u-1', email: 'owner@huppy.test' })],
    ]);
  });

  it('surfaces the backend’s reason for refusing', async () => {
    global.fetch = jest.fn(() =>
      jsonResponse({ error: 'Invalid email or password' }, false, 401)
    ) as jest.Mock;
    const auth = loadService();

    await expect(auth.loginEmailPassword('owner@huppy.test', 'wrong')).rejects.toThrow(
      'Invalid email or password'
    );
    expect(auth.getCurrentUser()).toBeNull();
  });

  it('still fails clearly when the backend sends no reason', async () => {
    global.fetch = jest.fn(() => jsonResponse({}, false, 500)) as jest.Mock;
    const auth = loadService();

    await expect(auth.loginEmailPassword('owner@huppy.test', 'x')).rejects.toThrow(
      'Request failed (500)'
    );
  });
});

describe('restoring a session', () => {
  it('brings back the user saved on this device', async () => {
    (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
      [ACCESS_KEY, 'access-1'],
      [REFRESH_KEY, 'refresh-1'],
      [USER_KEY, JSON.stringify({ id: 'u-1', email: 'owner@huppy.test' })],
    ]);
    const auth = loadService();

    const user = await auth.restoreSession();

    expect(user).toEqual({ id: 'u-1', email: 'owner@huppy.test' });
    await expect(auth.getAccessToken()).resolves.toBe('access-1');
  });

  it('reports no session when nothing was stored', async () => {
    (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
      [ACCESS_KEY, null],
      [REFRESH_KEY, null],
      [USER_KEY, null],
    ]);
    const auth = loadService();

    await expect(auth.restoreSession()).resolves.toBeNull();
  });

  it('does not restore a token without the user it belongs to', async () => {
    (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
      [ACCESS_KEY, 'access-1'],
      [REFRESH_KEY, 'refresh-1'],
      [USER_KEY, null],
    ]);
    const auth = loadService();

    await expect(auth.restoreSession()).resolves.toBeNull();
  });

  it('clears a corrupt session rather than locking the user out', async () => {
    (AsyncStorage.multiGet as jest.Mock).mockResolvedValue([
      [ACCESS_KEY, 'access-1'],
      [REFRESH_KEY, 'refresh-1'],
      [USER_KEY, 'not json'],
    ]);
    const auth = loadService();

    await expect(auth.restoreSession()).resolves.toBeNull();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      ACCESS_KEY,
      REFRESH_KEY,
      USER_KEY,
    ]);
  });
});

describe('signing out', () => {
  it('forgets the user and wipes the stored session', async () => {
    global.fetch = jest.fn(() => jsonResponse(session)) as jest.Mock;
    const auth = loadService();
    await auth.loginEmailPassword('owner@huppy.test', 'secret');

    await auth.logout();

    expect(auth.getCurrentUser()).toBeNull();
    await expect(auth.getAccessToken()).resolves.toBeNull();
    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
      ACCESS_KEY,
      REFRESH_KEY,
      USER_KEY,
    ]);
  });
});

describe('password reset', () => {
  it('fails loudly rather than pretending mail was sent', async () => {
    const auth = loadService();

    await expect(auth.sendPasswordResetEmail('owner@huppy.test')).rejects.toThrow(
      /not available/i
    );
  });
});
