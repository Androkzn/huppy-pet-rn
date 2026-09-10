/**
 * Per-route scroll offsets.
 *
 * A navigation bar and the screen under it are siblings in React Navigation's
 * tree, so the bar cannot read the screen's scroll position through context.
 * Both look it up here by route name instead: the screen writes its offset, the
 * bar reads it to collapse the large title and fade in its separator — the
 * behaviour iOS gives every scrolling screen.
 */

import { useMemo } from 'react';
import { makeMutable, type SharedValue } from 'react-native-reanimated';

const registry = new Map<string, SharedValue<number>>();

export const getScrollOffset = (routeKey: string): SharedValue<number> => {
  let value = registry.get(routeKey);
  if (!value) {
    value = makeMutable(0);
    registry.set(routeKey, value);
  }
  return value;
};

/** The shared scroll offset for a route, stable across re-renders. */
export const useScrollOffset = (routeKey: string): SharedValue<number> =>
  useMemo(() => getScrollOffset(routeKey), [routeKey]);

/** Distance the large title travels before the compact title takes over. */
export const LARGE_TITLE_COLLAPSE = 44;
