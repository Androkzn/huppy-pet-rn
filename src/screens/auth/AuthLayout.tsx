/**
 * AuthLayout — the shared scaffold for sign-in, sign-up and password reset.
 *
 * The iOS sign-in shape: the app's mark, a large title stating what the screen
 * is for, the fields directly beneath it, and one prominent full-width action
 * at the bottom of the column. The layout lifts above the keyboard and the
 * whole column stays centred and capped so it reads the same on any size.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@theme/ThemeProvider';
import { layout, spacing } from '@theme/tokens';
import { Asset } from '@components/ui/Asset';
import { IOSButton } from '@components/ios/Button';
import { Label } from '@components/ios/Text';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Primary action, shown as the prominent button under the fields. */
  actionLabel: string;
  onAction: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  /** Explanation shown between the fields and the action, e.g. a validation tip. */
  hint?: string;
  hintTone?: 'neutral' | 'error';
  /** Links under the action. */
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  actionLabel,
  onAction,
  actionDisabled,
  actionLoading,
  hint,
  hintTone = 'neutral',
  footer,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.groupedBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + layout.navBarHeight + spacing.xxl,
            paddingBottom: insets.bottom + spacing.xxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          <View style={styles.header}>
            <Asset imageName="logo_green_stroke.png" width={132} height={56} />
            <Label variant="title1" brand style={styles.title}>
              {title}
            </Label>
            {subtitle ? (
              <Label variant="subheadline" role="secondary" style={styles.subtitle}>
                {subtitle}
              </Label>
            ) : null}
          </View>

          <View style={styles.fields}>{children}</View>

          {hint ? (
            <Label
              variant="footnote"
              role={hintTone === 'error' ? 'destructive' : 'secondary'}
              style={styles.hint}
            >
              {hint}
            </Label>
          ) : null}

          <IOSButton
            title={actionLabel}
            variant="prominent"
            size="lg"
            fullWidth
            haptic="medium"
            disabled={actionDisabled}
            loading={actionLoading}
            onPress={onAction}
          />

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding + 4,
  },
  column: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  fields: {
    gap: spacing.md,
  },
  hint: {
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});

export default AuthLayout;
