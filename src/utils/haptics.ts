/**
 * Haptics.
 *
 * iOS pairs meaningful state changes with a tap you can feel: selection for
 * moving between options, impact for a control committing, notification for an
 * outcome. Every call is fire-and-forget — a device without a Taptic Engine
 * (and every simulator) simply rejects, which must never surface as an error.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const fire = (run: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  run().catch(() => {});
};

export const haptics = {
  /** Moving between segments, tabs or picker values. */
  selection: () => fire(() => Haptics.selectionAsync()),
  /** A light control accepting a tap. */
  light: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** A primary action committing. */
  medium: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** A sheet snapping, a card dropping into place. */
  heavy: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  /** Something soft, like a toggle settling. */
  soft: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)),
  success: () =>
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () =>
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () =>
    fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
} as const;

export default haptics;
