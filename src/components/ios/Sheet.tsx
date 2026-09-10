/**
 * Sheet — the iOS modal sheet.
 *
 * Rises on a spring, carries a grabber, and follows the finger down: past a
 * short throw, or thrown fast enough, it dismisses; otherwise it settles back.
 * The surface takes the sheet's large continuous radius and the toolbar row
 * follows the platform's Cancel-left / confirm-right convention.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@theme/ThemeProvider';
import { motion, radius, spacing } from '@theme/tokens';
import { haptics } from '@utils/haptics';
import { Label } from './Text';

export interface SheetProps {
  open: boolean;
  onDismiss?: () => void;
  title?: string;
  /** Right-hand confirm action, as iOS puts it. */
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  cancelLabel?: string;
  /** Sheet height as a share of the screen; content scrolls within it. */
  detent?: 'medium' | 'large' | 'auto';
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

export const Sheet: React.FC<SheetProps> = ({
  open,
  onDismiss,
  title,
  confirmLabel,
  onConfirm,
  confirmDisabled = false,
  cancelLabel = 'Cancel',
  detent = 'auto',
  scrollable = true,
  style,
  children,
}) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { colors } = theme;

  const [mounted, setMounted] = useState(open);
  const translateY = useSharedValue(height);
  const backdrop = useSharedValue(0);

  const finishClose = useCallback(() => {
    setMounted(false);
    onDismiss?.();
  }, [onDismiss]);

  const close = useCallback(() => {
    backdrop.value = withTiming(0, { duration: motion.duration.base });
    translateY.value = withTiming(
      height,
      { duration: motion.duration.base },
      (finished) => {
        if (finished) runOnJS(finishClose)();
      }
    );
  }, [backdrop, finishClose, height, translateY]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.value = height;
      backdrop.value = withTiming(1, { duration: motion.duration.base });
      translateY.value = withSpring(0, motion.sheet);
    } else if (mounted) {
      close();
    }
    // `mounted` is intentionally not a dependency: it is the effect's own output.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY;
      if (shouldClose) {
        runOnJS(haptics.light)();
        backdrop.value = withTiming(0, { duration: motion.duration.fast });
        translateY.value = withTiming(
          height,
          { duration: motion.duration.fast },
          (finished) => {
            if (finished) runOnJS(finishClose)();
          }
        );
      } else {
        translateY.value = withSpring(0, motion.sheet);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const maxHeight =
    detent === 'medium' ? height * 0.55 : detent === 'large' ? height * 0.92 : height * 0.86;

  const Body = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
    >
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
            onPress={close}
          />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardHost}
          pointerEvents="box-none"
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                maxHeight,
                paddingBottom: Math.max(insets.bottom, spacing.base),
                backgroundColor: colors.groupedBackground,
                ...theme.shadow('lg'),
              },
              sheetStyle,
              style,
            ]}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.grabberArea}>
                <View style={[styles.grabber, { backgroundColor: colors.tertiaryLabel }]} />
              </View>
            </GestureDetector>

            {title || confirmLabel ? (
              <View style={styles.toolbar}>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={close}
                  style={styles.toolbarSide}
                >
                  <Label variant="body" role="tint">
                    {cancelLabel}
                  </Label>
                </Pressable>

                <Label variant="headline" numberOfLines={1} style={styles.toolbarTitle}>
                  {title}
                </Label>

                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  disabled={!onConfirm || confirmDisabled}
                  onPress={() => {
                    haptics.medium();
                    onConfirm?.();
                  }}
                  style={[styles.toolbarSide, styles.toolbarTrailing]}
                >
                  {confirmLabel ? (
                    <Label
                      variant="headline"
                      role="tint"
                      style={confirmDisabled ? styles.disabled : undefined}
                    >
                      {confirmLabel}
                    </Label>
                  ) : null}
                </Pressable>
              </View>
            ) : null}

            <Body
              style={styles.body}
              contentContainerStyle={scrollable ? styles.bodyContent : undefined}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </Body>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardHost: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  grabberArea: {
    paddingTop: 8,
    paddingBottom: 6,
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: radius.capsule,
    opacity: 0.6,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  toolbarSide: {
    minWidth: 68,
  },
  toolbarTrailing: {
    alignItems: 'flex-end',
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: spacing.base,
  },
  disabled: {
    opacity: 0.4,
  },
});

export default Sheet;
