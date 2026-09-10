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

const offsets = new Map<string, SharedValue<number>>();
/**
 * Whether a route leads with a large title. A bar only has something to fade in
 * for if the title starts in the content and scrolls away; without one the bar
 * carries the title from the first frame and must be opaque immediately, or the
 * content passing beneath it collides with the title.
 */
const largeTitles = new Map<string, SharedValue<number>>();

const shared = (
  store: Map<string, SharedValue<number>>,
  key: string,
  initial: number
): SharedValue<number> => {
  let value = store.get(key);
  if (!value) {
    value = makeMutable(initial);
    store.set(key, value);
  }
  return value;
};

export const getScrollOffset = (routeKey: string): SharedValue<number> =>
  shared(offsets, routeKey, 0);

/** 1 while the route renders a large title in its content, 0 otherwise. */
export const getLargeTitleFlag = (routeKey: string): SharedValue<number> =>
  shared(largeTitles, routeKey, 0);

/** The shared scroll offset for a route, stable across re-renders. */
export const useScrollOffset = (routeKey: string): SharedValue<number> =>
  useMemo(() => getScrollOffset(routeKey), [routeKey]);

/** The shared large-title flag for a route, stable across re-renders. */
export const useLargeTitleFlag = (routeKey: string): SharedValue<number> =>
  useMemo(() => getLargeTitleFlag(routeKey), [routeKey]);

/** Distance the large title travels before the compact title takes over. */
export const LARGE_TITLE_COLLAPSE = 44;
