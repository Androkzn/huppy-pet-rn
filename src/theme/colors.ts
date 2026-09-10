/**
 * Food category colors.
 *
 * These are data, not chrome: a category keeps its colour across the pie chart,
 * the legend and the progress rows, so the same food reads the same everywhere.
 * The interface palette lives in `./tokens` and resolves per appearance; these
 * do not, because a category's identity should not change with the theme.
 */

export const meat = '#D3752B';
export const bones = '#E4DDCB';
export const liver = '#562A0D';
export const giblets = '#C9B487';
export const veggie = '#2B6362';
export const fruits = '#F3BC48';
export const seeds = '#939786';
export const fish = '#2C5666';
export const fiber = '#E8D8C9';
export const other = '#3A87BD';

/** Fallback for a category with no colour of its own. */
export const grayDark = '#979797';
