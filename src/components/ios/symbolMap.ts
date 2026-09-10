/**
 * Legacy icon name → SF Symbol.
 *
 * The screens address icons by the file names the web app used
 * (`<Asset imageName="delete_green.svg" />`). Mapping those names onto SF
 * Symbols upgrades every icon in the app at once, keeps them optically matched
 * to the system font, and leaves the call sites untouched. Anything without an
 * entry — artwork, placeholders, the wordmark — keeps rendering its SVG.
 *
 * The colour suffix in the name carries the intent, so it is translated into a
 * semantic role rather than a fixed colour.
 */

import type { SFSymbol } from 'expo-symbols';
import type { Palette } from '@theme/tokens';

export type SymbolTone = 'label' | 'secondary' | 'tint' | 'accent' | 'onTint' | 'destructive';

export interface SymbolMapping {
  symbol: SFSymbol;
  tone: SymbolTone;
}

/** Colour suffix on a legacy asset name → the role it stood for. */
const toneFor = (name: string): SymbolTone => {
  if (name.includes('_white')) return 'onTint';
  if (name.includes('_orange')) return 'tint';
  if (name.includes('_green')) return 'accent';
  return 'label';
};

const SYMBOLS: Record<string, SFSymbol> = {
  // Actions
  'add_black.svg': 'plus',
  'add_green.svg': 'plus',
  'add_orange.svg': 'plus',
  'add_white.svg': 'plus',
  'add_round_black.svg': 'plus.circle.fill',
  'add_round_green.svg': 'plus.circle.fill',
  'add_round_orange.svg': 'plus.circle.fill',
  'add_round_white.svg': 'plus.circle.fill',
  'plus_round_button.svg': 'plus.circle',
  'plus_round_fill_button.svg': 'plus.circle.fill',
  'plus_round_fill_white_button.svg': 'plus.circle.fill',
  'minus_round_button.svg': 'minus.circle',
  'delete_black.svg': 'trash',
  'delete_green.svg': 'trash',
  'delete_orange.svg': 'trash',
  'delete_white.svg': 'trash',
  'edit_black.svg': 'pencil',
  'edit_green.svg': 'pencil',
  'edit_orange.svg': 'pencil',
  'edit_white.svg': 'pencil',
  'copy_black.svg': 'doc.on.doc',
  'copy_green.svg': 'doc.on.doc',
  'copy_orange.svg': 'doc.on.doc',
  'copy_white.svg': 'doc.on.doc',
  'save_black.svg': 'checkmark',
  'save_green.svg': 'checkmark',
  'save_orange.svg': 'checkmark',
  'save_white.svg': 'checkmark',
  'cancel_black.svg': 'xmark',
  'cancel_green.svg': 'xmark',
  'cancel_orange.svg': 'xmark',
  'cancel_white.svg': 'xmark',
  'close_round_black.svg': 'xmark.circle.fill',
  'close_round_green.svg': 'xmark.circle.fill',
  'close_round_orange.svg': 'xmark.circle.fill',
  'close_round_white.svg': 'xmark.circle.fill',
  'checkmark_black.svg': 'checkmark',
  'checkmark_green.svg': 'checkmark',
  'checkmark_orange.svg': 'checkmark',
  'checkmark_white.svg': 'checkmark',

  // Direction
  'arrow_left_black.svg': 'chevron.left',
  'arrow_left_green.svg': 'chevron.left',
  'arrow_left_orange.svg': 'chevron.left',
  'arrow_right_black.svg': 'chevron.right',
  'arrow_right_green.svg': 'chevron.right',
  'arrow_right_orange.svg': 'chevron.right',
  'arrow_up_black.svg': 'chevron.up',
  'arrow_up_green.svg': 'chevron.up',
  'arrow_up_orange.svg': 'chevron.up',
  'arrow_down_black.svg': 'chevron.down',
  'arrow_down_green.svg': 'chevron.down',
  'arrow_down_orange.svg': 'chevron.down',
  'back_arrow.svg': 'chevron.left',
  'more_black.svg': 'ellipsis',
  'more_green.svg': 'ellipsis',
  'more_orange.svg': 'ellipsis',
  'more_white.svg': 'ellipsis',

  // Account
  'add_profile.svg': 'person.badge.plus',
  'change_profile.svg': 'arrow.left.arrow.right',
  'delete_account.svg': 'person.crop.circle.badge.xmark',
  'logout_tab_icon_unselected.svg': 'rectangle.portrait.and.arrow.right',
  'show_password.svg': 'eye',
  'hide_password.svg': 'eye.slash',

  // Tabs and sections
  'diary_tab_icon_unselected.svg': 'fork.knife',
  'dashboard_tab_icon_unselected.svg': 'chart.pie',
  'training_tab_icon_unselected.svg': 'figure.run',
  'more_tab_icon_unselected.svg': 'ellipsis.circle',
  'activity_tab_icon_unselected.svg': 'figure.walk',
  'health_tab_icon_unselected.svg': 'heart.text.square.fill',

  // Activities
  'activity_walk.svg': 'figure.walk',
  'activity_run.svg': 'figure.run',
  'activity_swim.svg': 'figure.pool.swim',
  'activity_fetch.svg': 'tennisball.fill',

  // Training categories
  'training_obedience.svg': 'graduationcap.fill',
  'training_potty.svg': 'toilet.fill',
  'training_social.svg': 'bubble.left.and.bubble.right.fill',
  'training_sounds.svg': 'speaker.wave.2.fill',
  'training_items.svg': 'shippingbox.fill',
  'training_custom.svg': 'star.fill',
  'trophy.svg': 'trophy.fill',
};

/** The symbol an icon name stands for, or `null` if it is artwork. */
export const symbolFor = (imageName: string): SymbolMapping | null => {
  const symbol = SYMBOLS[imageName];
  if (!symbol) return null;
  return { symbol, tone: toneFor(imageName) };
};

/** Resolves a tone against the active palette. */
export const toneColor = (tone: SymbolTone, colors: Palette): string => {
  switch (tone) {
    case 'onTint':
      return colors.onTint;
    case 'tint':
      return colors.tint;
    case 'accent':
      return colors.accentSecondary;
    case 'secondary':
      return colors.secondaryLabel;
    case 'destructive':
      return colors.red;
    default:
      return colors.label;
  }
};
